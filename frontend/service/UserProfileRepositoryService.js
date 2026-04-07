import Service from "./Service.js";
import { Events } from "../eventhub/Events.js";

export class UserProfileRepositoryService extends Service {
  constructor() {
    super();
    this.dbName = "profileDB";
    this.storeName = "userProfile";
    this.db = null;

    this.ready = this.initDB().then(() => this.loadProfileFromDB());
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(this.storeName, { keyPath: "id" });
      };
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };
      request.onerror = () => reject("Error initializing IndexedDB");
    });
  }

  async storeProfile(data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], "readwrite");
      const store = tx.objectStore(this.storeName);
      const req = store.put({ id: "profile", ...data });

      req.onsuccess = () => {
        this.publish(Events.StoreProfileSuccess, data);
        resolve();
      };
      req.onerror = () => {
        this.publish(Events.StoreProfileFailure, data);
        reject();
      };
    });
  }

  async loadProfileFromDB() {
    if (!this.db) await this.ready;
    
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], "readonly");
      const store = tx.objectStore(this.storeName);
      const req = store.get("profile");

      req.onsuccess = (event) => {
        this.publish(Events.LoadProfileSuccess, event.target.result || {});
        resolve();
      };
      req.onerror = () => reject("Failed to load profile");
    });
  }

  addSubscriptions() {
    this.subscribe(Events.StoreProfile, (data) => this.storeProfile(data));
    this.subscribe(Events.UnstoreProfile, () => this.clearProfile());
  }

  async clearProfile() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], "readwrite");
      const store = tx.objectStore(this.storeName);
      const req = store.clear();

      req.onsuccess = () => resolve();
      req.onerror = () => reject("Failed to clear profile");
    });
  }
}
