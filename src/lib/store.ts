import { Database, ref, set, get, child } from "firebase/database";
import type { Store, Times } from "$lib/types";

export function create(db: Database): Store {
    return {
        setTimes: async (id: string, times: Times) => set(ref(db, `athletes/${id}/times`), times),
        getTimes: async (id: string) => (await get(child(ref(db), `athletes/${id}/times`))).toJSON() as Times | null,
    };
}
