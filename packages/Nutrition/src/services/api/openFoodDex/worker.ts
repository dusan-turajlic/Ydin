// src/worker.ts
import type { IOpenFoodDexArray, IOpenFoodDexObject } from "@/modals";

/** Message types from the main thread */
type Msg =
    | { type: "init" }  // Port is passed via transferable
    | { type: "start"; url: string }
    | { type: "stop" };

const BATCH_SIZE = 100;

interface IOpenFoodDexObjectWithPath {
    path: string;
    data: IOpenFoodDexObject;
}

/** MessagePort to communicate with Database Worker */
let dbPort: MessagePort | null = null;

/** Request ID counter for matching responses */
let requestId = 0;

/** Pending request promises */
const pending = new Map<number, { resolve: () => void; reject: (err: Error) => void }>();

self.addEventListener("message", (e: MessageEvent<Msg>) => {
    console.debug("worker onmessage", e.data);

    // Initialize with the database worker port
    if (e.data?.type === "init" && e.ports[0]) {
        dbPort = e.ports[0];
        dbPort.onmessage = handleDBResponse;
        dbPort.start();
    }

    if (e.data?.type === "start") {
        if (!dbPort) {
            postMessage({ type: "error", data: { message: "Database port not initialized" } });
            return;
        }
        run(e.data.url).catch((err) => {
            postMessage({ type: "error", data: { message: String(err?.message ?? err) } });
        });
    }
});

/**
 * Handle responses from the Database Worker
 */
function handleDBResponse(msg: MessageEvent<{ id: number; success: boolean; error?: string }>) {
    const { id, success, error } = msg.data;
    const p = pending.get(id);
    if (p) {
        pending.delete(id);
        if (success) {
            p.resolve();
        } else {
            p.reject(new Error(error ?? 'Unknown database error'));
        }
    }
}

/**
 * Write a batch of records to the database via the Database Worker
 */
function writeBatch(dataArray: IOpenFoodDexObjectWithPath[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!dbPort) {
            reject(new Error("Database port not initialized"));
            return;
        }
        const id = ++requestId;
        pending.set(id, { resolve, reject });
        dbPort.postMessage({ id, op: 'createMany', dataArray, generateId: false });
    });
}

async function run(url: string) {
    const res = await fetch(url, {
        headers: new Headers({
            'Accept': 'application/x-ndjson',
            'Accept-Encoding': 'br',
            'Content-Encoding': 'br'
        })
    });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

    if (typeof globalThis.DecompressionStream !== "function") {
        throw new Error("DecompressionStream is not supported in this context");
    }

    const readable = res.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(linesToObjects());

    let count = 0;
    const batch: IOpenFoodDexObjectWithPath[] = [];

    await readable.pipeTo(new WritableStream<IOpenFoodDexObjectWithPath>({
        async write(obj) {
            batch.push(obj);
            if (batch.length >= BATCH_SIZE) {
                await writeBatch(batch);
                count += batch.length;
                batch.length = 0;
                postMessage({ type: "progress", data: { count } });
            }
        },
        async close() {
            if (batch.length) {
                await writeBatch(batch);
                count += batch.length;
                batch.length = 0;
                postMessage({ type: "progress", data: { count } });
            }
            postMessage({ type: "done" });
        },
        abort(reason) {
            postMessage({ type: "error", data: { message: String(reason) } });
        }
    }));
}

function linesToObjects() {
    let buf = "";
    return new TransformStream<string, IOpenFoodDexObjectWithPath>({
        transform(chunk, controller) {
            buf += chunk;
            const lines = buf.split(/\r?\n/);
            buf = lines.pop() ?? "";
            for (const line of lines) {
                if (!line) continue;
                const [
                    code,
                    name,
                    brand,
                    categories,
                    serving_size,
                    serving_unit,
                    fiber,
                    carbs,
                    fat,
                    protein
                ] = JSON.parse(line) as IOpenFoodDexArray;

                // The object code should always be defined
                const path = `/products/name-${name}-brand-${brand}-code-${code}`;
                const obj: IOpenFoodDexObject = {
                    code: code ?? "",
                    name: name ?? "",
                    brand: brand ?? "",
                    categories: categories ?? [],
                    serving_size,
                    serving_unit,
                    kcal: getKcal(fiber, carbs, fat, protein),
                    fiber,
                    carbs,
                    fat,
                    protein
                };

                controller.enqueue({ path, data: obj });
            }
        },
        flush(controller) {
            const last = buf.trim();
            if (last) controller.enqueue(JSON.parse(last));
        }
    });
}

function getKcal(fiber?: number, carbs?: number, fat?: number, protein?: number) {
    if (fiber === undefined || carbs === undefined || fat === undefined || protein === undefined) {
        return undefined;
    }
    return ((carbs * 4) - (fiber * 4)) + (fat * 9) + (protein * 4);
}
