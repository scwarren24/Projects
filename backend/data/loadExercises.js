import fetch from 'node-fetch';

const GITHUB_DATA_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

function normalizeDifficulty(level) {
    if (!level) return "Unknown";
    const map = {
        beginner: "Easy",
        intermediate: "Medium",
        advanced: "Hard",
        expert: "Hard"
    };
    return map[level.toLowerCase()] || "Unknown";
}

async function loadExercisesFromGithub() {
    try {
        const response = await fetch(GITHUB_DATA_URL);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Failed to fetch exercises from GitHub. Status: ${response.status}. Error: ${errorBody}`);
            return;
        }

        const data = await response.json();

        for (const exercise of data.slice(249,300)) {
            const name = exercise.name?.trim();
            const category = exercise.primaryMuscles[0]?.trim() || "Unknown";
            const difficulty = normalizeDifficulty(exercise.level?.trim()) || "Unknown";
            const goal = exercise.category.trim() || "Unknown"
            const tags = [
                category,
                difficulty,
                goal
            ];
            
            const exerciseData = {
                name,
                category,
                difficulty,
                tags,
                videoURL: ""
            };

            tags.classList

            const postResponse = await fetch('http://localhost:3000/api/exercises', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(exerciseData),
            });

            if (!postResponse.ok) {
                const errorBody = await postResponse.text();
                console.error(`Failed to load: ${exercise.name}\n${errorBody}`);
            } else {
                console.log(`Loaded: ${exercise.name}`);
            }
        }
    } catch (err) {
        console.error("Error loading exercises from GitHub:", err);
    }
}

loadExercisesFromGithub();
