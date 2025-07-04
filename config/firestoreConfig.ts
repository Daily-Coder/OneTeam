import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./fbConfig";

export class firestoreConfig{
    private static instance: firestoreConfig;
        private db;
    
        private constructor() {
            const instance=firebaseConfig.getInstance()
            this.db=getFirestore(instance.getApp())
        }
    
        public static getInstance() {
            if (!this.instance) {
                this.instance = new firestoreConfig()
            }
            return this.instance
        }

        getDb(){
            return this.db
        }
}