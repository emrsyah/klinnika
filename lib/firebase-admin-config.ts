import {
  initializeApp,
  getApps,
  cert,
  ServiceAccount,
} from "firebase-admin/app";
import jsonKey from "../service-key-klinnika.json";

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp({
      credential: cert(jsonKey as ServiceAccount),
      databaseURL: "https://klinnika-5ea40. asia-southeast2.firebaseio.com",
    });
  }
}
