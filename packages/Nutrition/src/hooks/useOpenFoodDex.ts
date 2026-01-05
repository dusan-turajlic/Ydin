// src/useOpenFoodDex.ts (example hook you call once on app load)
import createProvider from "@ydin/storage-provider";
import { useEffect, useRef } from "react";

const provider = createProvider('local');
const PATH_LOCAL_APP_DATA = '/local/app-data';
const PATH_OPEN_FOOD_DEX = `${PATH_LOCAL_APP_DATA}/open-food-dex`;

type OpenFoodDexContent = {
    [key: string]: {
        exists: boolean;
    };
}

async function startOpenFoodDexWorker(url: string, worker: Worker) {
    const triggerWorker = async () => {
        await provider.create(PATH_OPEN_FOOD_DEX, { exists: true });

        worker.addEventListener('message', async (e) => {
            if (e.data?.type === 'done') {
                console.debug('done');
            }
        });

        worker.postMessage({ type: "start", url });
    }

    const content = await provider.getAll<OpenFoodDexContent>(PATH_OPEN_FOOD_DEX).catch(() => ({}));
    if (!Object.keys(content).length) {
        triggerWorker();
        return;
    }

    const [first] = Object.values(content);
    if (first.exists) {
        return;
    }

    triggerWorker();
}

export function useOpenFoodDex(url: string) {
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        workerRef.current = new Worker(new URL("@/services/api/openFoodDex/worker.ts", import.meta.url), { type: "module" });
        void startOpenFoodDexWorker(url, workerRef.current);

        return () => {
            workerRef.current?.terminate();
            workerRef.current = null;
        };
    }, [url]);

    return { workerRef };
}