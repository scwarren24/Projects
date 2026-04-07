import Service from "./Service.js";
import { fetch } from "../utility/fetch.js";
import { Events } from "../eventhub/Events.js";

export class UserProfileRemoteFakeService extends Service {
  constructor() {
    super();
  }

  async storeProfile(data) {
    try {
      const response = await fetch("http://localhost:3000/profile", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      this.publish(Events.StoreProfileSuccess, result);
    } catch (e) {
      this.publish(Events.StoreProfileFailure, data);
    }
  }

  addSubscriptions() {
    this.subscribe(Events.StoreProfile, (data) => {
      this.storeProfile(data);
    });
  }
}
