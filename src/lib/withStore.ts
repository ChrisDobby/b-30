import { initializeApp, FirebaseApp } from "firebase/app";
import * as database from "firebase/database";
import { create } from "$lib/store";
// import type { Api } from "$lib/types";

let app: FirebaseApp | null = null;

const withStore = (api: (arg1: any, arg2: any) => any) => (arg1: any, arg2: any) => {
    if (!app) {
        app = initializeApp({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            appId: process.env.FIREBASE_APP_ID,
        });
    }

    const db = database.getDatabase(app);
    return api(arg1, { ...arg2, store: create(db) });
};

export default withStore;
