import { EventHub } from "../eventhub/EventHub.js";
import { Events } from "../eventhub/Events.js";

const hub = EventHub.getInstance();

const fieldMap = {
  height: ['height', 'height-inpt'],
  weight: ['weight', 'weight-inpt'],
  goalWeight: ['goal-weight', 'goal-weight-inpt'],
  dob: ['dob'],
  gender: ['gender', 'gender-inpt'],
  activity: ['activity-level', 'activity']
};

function getEl(id) {
  return document.getElementById(id);
}

function populate(data) {
  for (const [key, ids] of Object.entries(fieldMap)) {
    const value = data[key];
    if (value) {
      ids.forEach(id => {
        const el = getEl(id);
        if (el) el.value = value;
      });
    }
  }
}

function collect() {
  const data = {};
  for (const [key, ids] of Object.entries(fieldMap)) {
    for (const id of ids) {
      const el = getEl(id);
      if (el && el.value) {
        data[key] = el.value;
        break;
      }
    }
  }
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  for (const ids of Object.values(fieldMap)) {
    ids.forEach(id => {
      const el = getEl(id);
      if (el) {
        el.addEventListener("change", () => {
          const profile = collect();
          hub.publish(Events.StoreProfile, profile);
        });
      }
    });
  }

  hub.subscribe(Events.LoadProfileSuccess, (data) => {
    populate(data);
  });
});
