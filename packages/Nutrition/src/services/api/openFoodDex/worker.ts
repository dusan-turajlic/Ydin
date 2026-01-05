// src/worker.ts
import createProvider from "@ydin/storage-provider";
import type { IOpenFoodDexArray, IOpenFoodDexObject } from "@/modals";
import { DB_NAME, DB_VERSION } from ".";


type Msg =
    | { type: "start"; url: string }
    | { type: "stop" };

const BATCH_SIZE = 100;

interface IOpenFoodDexObjectWithPath {
    path: string;
    data: IOpenFoodDexObject;
}

const provider = createProvider("sqlite", DB_NAME, DB_VERSION); // create once

self.addEventListener("message", (e: MessageEvent<Msg>) => {
    console.debug("worker onmessage", e.data);
    if (e.data?.type === "start") {
        run(e.data.url).catch((err) => {
            postMessage({ type: "error", data: { message: String(err?.message ?? err) } });
        });
    }
});

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
                await provider.createMany(batch, false);
                count += batch.length;
                batch.length = 0;
                postMessage({ type: "progress", data: { count } });
            }
        },
        async close() {
            if (batch.length) {
                await provider.createMany(batch, false);
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