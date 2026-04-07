const DB_NAME = 'workoutTrackerDB'; 
const DB_STORE_NAME = 'workouts';

let db;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function (e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
                db.createObjectStore(DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = function (e) {
            db = e.target.result;
            resolve(db);
        };

        request.onerror = function (e) {
            reject('Failed to open : ' + e.target.errorCode);
        };
    });
}

function addWorkout(workout) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([DB_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(DB_STORE_NAME);
        const request = store.add(workout);

        request.onsuccess = function () {
            resolve();
        };

        request.onerror = function (e) {
            reject('Failed to add workout: ' + e.target.errorCode);
        };
    });
}

function getAllWorkouts() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([DB_STORE_NAME], 'readonly');
        const store = transaction.objectStore(DB_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function (e) {
            reject('Failed to get workouts: ' + e.target.errorCode);
        };
    });
}

function clearWorkouts() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([DB_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(DB_STORE_NAME);
        const request = store.clear();

        request.onsuccess = function () {
            resolve();
        };

        request.onerror = function (e) {
            reject('Failed to clear workouts: ' + e.target.errorCode);
        };
    });
}

openDB().then(() => {
    console.log('IndexedDB is ready!');
}).catch((error) => {
    console.error(error);
});