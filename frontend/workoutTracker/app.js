document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("input");
    const activityInput = document.getElementById("activity");
    const durationInput = document.getElementById("duration");
    const distanceInput = document.getElementById("distance");
    const rpeInput = document.getElementById("rpe");
    const notesInput = document.getElementById("notes");

    const workoutHistory = document.getElementById("workout-history");
    console.log(workoutHistory);

    const totalDurationElem = document.getElementById("total-duration");
    const totalDistanceElem = document.getElementById("total-distance");
    const averageRpeElem = document.getElementById("average-rpe");

    const workouts = [];

    // const errors = {
    //     activity: document.getElementById("activity-error"),
    //     duration: document.getElementById("duration-error"),
    //     distance: document.getElementById("distance-error"),
    //     rpe: document.getElementById("rpe-error"),
    //     notes: document.getElementById("notes-error")
    // };

    function updateSummary() {
        let totalDuration = 0;
        let totalDistance = 0;
        let totalRpe = 0;

        workouts.forEach(workout => {
            totalDuration += workout.duration;
            totalDistance += workout.distance;
            totalRpe += workout.rpe;
        });

        const averageRpe = totalRpe / workouts.length;
        totalDurationElem.textContent = `Duration: ${Math.floor(totalDuration / 60)} hours ${totalDuration % 60} min`;
        totalDistanceElem.textContent = `Total Distance: ${totalDistance} miles`;
        averageRpeElem.textContent = `Average RPE: ${averageRpe.toFixed(2)}`;
    }


    async function addWorkout(workout) {
        // return new Promise((resolve, reject) => {
        //     const dbRequest = indexedDB.open("workoutTrackerDB", 1);
        //     dbRequest.onsuccess = (event) => {
        //         const db = event.target.result;
        //         const transaction = db.transaction("workouts", "readwrite");
        //         const store = transaction.objectStore("workouts");
        //         const request = store.add(workout);
        //         request.onsuccess = () => resolve();
        //         request.onerror = (err) => reject(err);
        //     };
        //     dbRequest.onerror = (event) => reject(event.target.error);
        // });
        try {
            const response = await fetch('http://localhost:3000/api/workout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(exercise),
            });
            if (!response.ok) {
                throw new Error('Error: ${response.status}');
            }
        } catch (error) {
            console.error('Error adding workout:', error);
        }
    }
    async function getAllWorkouts(workout) {
        try {
            const response = await fetch('http://localhost:3000/api/workout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error: ${response.status}');
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error fetching workouts:', error);
        }
        // return new Promise((resolve, reject) => {
        //     const dbRequest = indexedDB.open("workoutTrackerDB", 1);
        //     dbRequest.onsuccess = (event) => {
        //         const db = event.target.result;
        //         const transaction = db.transaction("workouts", "readonly");
        //         const store = transaction.objectStore("workouts");
        //         const request = store.getAll();
        //         request.onsuccess = (event) => resolve(event.target.result);
        //         request.onerror = (err) => reject(err);
        //     };
        //     dbRequest.onerror = (event) => reject(event.target.error);
        // });
    }
    async function getWorkoutById(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/workout/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error: ${response.status}');
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error fetching workout:', error);
        }
    }
    async function deleteWorkout(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/workout/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error: ${response.status}');
            }
        }
        catch (error) {
            console.error('Error deleting workout:', error);
        }

        // return new Promise((resolve, reject) => {
        //     const dbRequest = indexedDB.open("workoutTrackerDB", 1);
        //     dbRequest.onsuccess = (event) => {    
        //         const db = event.target.result;
        //         const transaction = db.transaction("workouts", "readwrite");
        //         const store = transaction.objectStore("workouts");
        //         const request = store.delete(id);
        //         request.onsuccess = () => resolve();
        //         request.onerror = (err) => reject(err);
        //     };
        //     dbRequest.onerror = (event) => reject(event.target.error);
        // });
    }
    function loadWorkoutsFromDB() {
        getAllWorkouts().then(fetchedWorkouts => {
            workouts = fetchedWorkouts;
            workoutHistory.innerHTML = '';
            workouts.forEach(workout => {
                const workoutItem = document.createElement("li");
                workoutItem.innerHTML = `
                    <strong>${new Date(workout.date).toLocaleDateString()}</strong><br />
                    <strong>Activity:</strong> ${workout.activity}<br />
                    <strong>Duration:</strong> ${workout.duration} min<br />
                    <strong>Distance:</strong> ${workout.distance} miles<br />
                    <strong>RPE:</strong> ${workout.rpe}<br />
                    <strong>Notes:</strong> ${workout.notes ? workout.notes : "None"}<br />
                `;
                workoutHistory.appendChild(workoutItem);
            });
            updateSummary();
        }).catch(err => {
            console.error('Failed to load:', err);
        });
    }

    function validateForm(activity, duration, distance, rpe) {
        if (isNaN(duration) || duration <= 0) {
            alert("Duration must be greater than 0");
            return false;
        }
        if (isNaN(distance) || distance < 0) {
            alert("Distance must be greater than or equal to 0");
            return false;
        }
        if (isNaN(rpe) || rpe < 0 || rpe > 10) {
            alert("RPE must be between 0 and 10");
            return false;
        }
        return true;
    }

    //if (workoutHistory.children.length === 1 && workoutHistory.children[0].innerText.includes("_")) {
    //    workoutHistory.innerHTML = "";
    //}

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const activity = activityInput.value;
        const duration = parseFloat(durationInput.value.trim());
        const distance = parseFloat(distanceInput.value.trim());
        const rpe = parseFloat(rpeInput.value.trim());
        const notes = notesInput.value.trim();

        console.log(activity, duration, distance, rpe, notes);
        const date = new Date();
        if (isNaN(date.getTime())) {
            console.error('Invalid Date object!');
            return;  
        }

        if (!validateForm(activity, duration, distance, rpe)) {
            return;
        }

        if (duration === ""|| rpe === "") {
            alert("Please fill out all required fields (duration and RPE)");
            return;
        }

        const workoutItem = document.createElement("li");
        //const date = new Date().toLocaleDateString();
        const workout = {
            activity,
            duration,
            distance,
            rpe,
            notes,
            date: date.toISOString()
        };

        workoutItem.innerHTML = `
            <strong>${date}</strong><br />
            <strong>Activity:</strong> ${activity}<br />
            <strong>Duration:</strong> ${duration} min<br />
            <strong>Distance:</strong> ${distance} miles<br />
            <strong>RPE:</strong> ${rpe}<br />
            <strong>Notes:</strong> ${notes ? notes : "None"}<br />
        `;

        workoutHistory.appendChild(workoutItem);
        console.log("Form submitted");

        addWorkout(workout).then(() => {
            workouts.push(workout);
            const workoutItem = document.createElement("li");
            workoutItem.innerHTML = `
                <strong>${date.toLocaleDateString()}</strong><br />
                <strong>Activity:</strong> ${activity}<br />
                <strong>Duration:</strong> ${duration} min<br />
                <strong>Distance:</strong> ${distance} miles<br />
                <strong>RPE:</strong> ${rpe}<br />
                <strong>Notes:</strong> ${notes ? notes : "None"}<br />
            `;
            workoutHistory.appendChild(workoutItem);
            updateSummary();

            form.reset();
        }).catch(err => {
            console.error('Failed to add:', err);
        });
        loadWorkoutsFromDB();

        workouts.push({
            activity: activity,
            duration: duration,
            distance: distance,
            rpe: rpe,
            notes: notes,
        });
        updateSummary();

        form.reset();
    });
    // form.addEventListener("reset", function (event) {
    //     event.preventDefault();
    //     activityInput.value = "";
    //     durationInput.value = "";
    //     distanceInput.value = "";
    //     rpeInput.value = "";
    //     notesInput.value = "";
    //     workoutHistory.innerHTML = "";
    //     totalDurationElem.textContent = "Total Duration: 0 min";
    //     totalDistanceElem.textContent = "Total Distance: 0 miles";
    //     averageRpeElem.textContent = "Average RPE: 0";
    //     workouts.length = 0; 
    //     console.log("Form reset");
    //     loadWorkoutsFromDB();   
    // })
    
});