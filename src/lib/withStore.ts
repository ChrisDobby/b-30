import { initializeApp, FirebaseApp } from "firebase/app";
import * as database from "firebase/database";
import { create } from "$lib/store";
import type { Api } from "$lib/types";
console.log(process.env.FIREBASE_API_KEY);

let app: FirebaseApp | null = null;

const withStore =
    (api: Api): Api =>
    (request, args) => {
        console.log(database);
        if (!app) {
            console.log("initializing app");
            app = initializeApp({
                apiKey: process.env.FIREBASE_API_KEY,
                authDomain: process.env.FIREBASE_AUTH_DOMAIN,
                databaseURL: process.env.FIREBASE_DATABASE_URL,
                projectId: process.env.FIREBASE_PROJECT_ID,
                appId: process.env.FIREBASE_APP_ID,
            });
        }

        console.log(app);

        const db = database.getDatabase(app);
        return api(request, { ...args, store: create(db) });
    };

export default withStore;
