
import { App, getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export class FirebaseAdminConfig {
    private static instance: FirebaseAdminConfig;
    private app: App;
    private db: FirebaseFirestore.Firestore;

    private constructor() {
        const encoded_key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        if (!encoded_key) {
            console.log("key not valid")
            throw new Error('key not found')
        }

        const serviceAccount = JSON.parse(
            Buffer.from(encoded_key, 'base64').toString('utf-8')
        );
        console.log("json parsed successfully")
        if (!getApps().length) {
            this.app = initializeApp({
                credential: cert(serviceAccount),
            });
        } else {
            this.app = getApps()[0];
        }
        this.db = getFirestore(this.app);
    }
    public static getInstance(): FirebaseAdminConfig {
        if (!this.instance) {
            this.instance = new FirebaseAdminConfig();
        }
        return this.instance;
    }

    public getDb() {
        return this.db;
    }

    public getAuth() {
        return getAuth(this.app);
    }

    public getApp() {
        return this.app;
    }
}
