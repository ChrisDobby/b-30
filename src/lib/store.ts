import { Database, ref, set } from "firebase/database";
import type { Store, Times } from "$lib/types";

export function create(db: Database): Store {
    return {
        setTimes: async (id: string, times: Times) => set(ref(db, `athletes/${id}/times`), times),
    };
}
