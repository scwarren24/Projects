const TARGET_GROUPS = {
    hamstrings: 'legs',
    quadriceps: 'legs',
    glutes: 'legs',
    adductors: 'legs',
    abductors: 'legs',
    calves: 'legs',
    biceps: 'arms',
    triceps: 'arms',
    forearms: 'arms',
    chest: 'chest',
    shoulders: 'shoulders',
    traps: 'arms',
    abdominals: 'core',
    obliques: 'core',
    lower_back: 'core',
    back: 'back',
    lats: 'back'
};


function convertToEmbedURL(url) {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
    if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    return url;
}

document.addEventListener("DOMContentLoaded", function () {
    loadExercisesFromDB();
    
    const searchInput = document.getElementById("searchInput");
    const filterSelect = document.getElementById("filterSelect");
    const addBtn = document.getElementById("addCardBtn");
    const modal = document.getElementById("addCardModal");
    const closeModal = document.getElementById("closeModal");
    const form = document.getElementById("addCardForm");
    const exerciseGrid = document.getElementById("exerciseGrid");

    async function addExerciseToDB(exercise) {
        try {
          const response = await fetch('http://localhost:3000/api/exercises', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(exercise),
          });
      
          // Check if the response is ok (status 200-299)
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
      
          // Try to parse the JSON response
          const data = await response.json();
          
          // Check if the response contains valid data
          if (!data) {
            throw new Error('Empty response from server');
          }
      
          console.log('Exercise added:', data); // Log the added exercise data
          addExerciseCardToDOM(data);
          loadExercisesFromDB();
          return data;
        } catch (error) {
          console.error('Error adding exercise:', error.message);
        }
      }
      
    

    async function deleteExerciseFromDB(id) {
        try {
            await fetch(`http://localhost:3000/api/exercises/${id}`, { method: 'DELETE' });
            console.log("Exercise deleted.");
        } catch (err) {
            console.error("Error deleting exercise:", err);
        }
    }
    

    async function loadExercisesFromDB() {
        try {
            const res = await fetch('http://localhost:3000/api/exercises');
            const exercises = await res.json();
            exerciseGrid.innerHTML = "";
            exercises.forEach(addExerciseCardToDOM);
        } catch (err) {
            console.error("Error loading exercises:", err);
        }
    }

    async function addExerciseCardToDOM(exercise) {
        const card = document.createElement("div");
        card.className = "exercise-card";
        const groupedCategory = TARGET_GROUPS[exercise.category.toLowerCase()] || exercise.category;
        card.setAttribute("data-id", exercise.id);
        card.setAttribute("data-category", groupedCategory);
        card.setAttribute("data-video", exercise.videoURL);
        
        const categoryTag = exercise.category || "Unknown";
        const difficultyTag = exercise.difficulty || "Unknown";
        const goalTag = (exercise.tags && exercise.tags[2]) ? exercise.tags[2] : "Goal";
        const pbTagObj = exercise.tags && exercise.tags.find(tag => tag.startsWith("pb:"));
        const pbTag = pbTagObj ? "Personal Best: " + pbTagObj.slice(3) : "";    
        card.innerHTML = `
            <h2>${exercise.name}</h2>
            <button class="delete-btn">&times</button>
            <div class="tags">
                <span class="tag target">${categoryTag.charAt(0).toUpperCase() + categoryTag.slice(1)}</span>
                <span class="tag ${difficultyTag.toLowerCase()}">${difficultyTag.charAt(0).toUpperCase() + difficultyTag.slice(1)}</span>
                <span class="tag goal">${goalTag.charAt(0).toUpperCase() + goalTag.slice(1)}</span>
                ${pbTag && pbTag !== "Personal Best: " ? `<span class="tag personal-best">${pbTag}</span>` : ""}
            </div>
            <button class="watch-video-btn">Form Video</button>
            <button class="edit-btn">Edit</button>
        `;
        exerciseGrid.appendChild(card);
        filterExercises();
    }
    

    function filterExercises() {
        let searchQuery = searchInput.value.toLowerCase();
        let selectedCategory = filterSelect.value;
        let cards = document.querySelectorAll(".exercise-card");

        if (!cards.length) {
            console.error("No exercise cards found!");
            return;
        }

        cards.forEach(card => {
            let title = card.querySelector("h2")?.textContent.toLowerCase() || "";
            let tags = card.querySelector(".tags")?.textContent.toLowerCase() || "";
            let category = card.getAttribute("data-category");

            let matchesSearch = title.includes(searchQuery) || tags.includes(searchQuery);
            let matchesFilter = selectedCategory === "all" || category === selectedCategory;

            card.style.display = matchesSearch && matchesFilter ? "block" : "none";
        });
    }

    addBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("exerciseName").value;
        const category = document.getElementById("exerciseCategory").value;
        const difficulty = document.getElementById("exerciseDifficulty").value;
        const goal = document.getElementById("exerciseGoal").value;
        const rawVideoLink = document.getElementById("exerciseVideo").value;
        const videoLink = convertToEmbedURL(rawVideoLink);
        const pbText = document.getElementById("exercisePBText").value.trim();

        const tags = [category, difficulty, goal];
        if (pbText) tags.push(`pb:${pbText}`);

        const exercise = {
            name,
            category,
            difficulty,
            tags: tags,
            videoURL: videoLink
        };

        addExerciseToDB(exercise).then(() => {
            form.reset();
            modal.classList.add("hidden");
        });
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-btn')) {
            const card = e.target.closest('.exercise-card');
            const id = Number(card.getAttribute("data-id"));
            card.remove()
            deleteExerciseFromDB(id);
        }
    });

    document.addEventListener('click', async function (e) {
        if (e.target.classList.contains('edit-btn')) {
            const card = e.target.closest('.exercise-card');
            const id = Number(card.getAttribute("data-id"));
    
            try {
                const res = await fetch(`http://localhost:3000/api/exercises/${id}`);
                const exercise = await res.json();
            
                if (exercise) {
                    document.getElementById("editExerciseId").value = exercise.id;
                    document.getElementById("editExerciseName").value = exercise.name;
                    document.getElementById("editExerciseCategory").value = exercise.category;
                    document.getElementById("editExerciseDifficulty").value = exercise.difficulty;
                    document.getElementById("editExerciseGoal").value = exercise.tags[2] || "";
                    document.getElementById("editExerciseVideo").value = exercise.videoURL;
                    const pbTag = exercise.tags.find(tag => tag.startsWith("pb:"));
                    document.getElementById("editExercisePBText").value = pbTag ? pbTag.split("pb:")[1] : "";
            
                    document.getElementById("editCardModal").classList.remove("hidden");
                }
            } catch (err) {
                console.error("Failed to load exercise:", err);
            }
            
        }
    });
    
    

    searchInput.addEventListener("keyup", filterExercises);
    filterSelect.addEventListener("change", filterExercises);

    const videoModal = document.getElementById("videoModal");
    const videoFrame = document.getElementById("videoFrame");
    const closeVideoModal = document.getElementById("closeVideoModal");

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("watch-video-btn")) {
            const card = e.target.closest(".exercise-card");
            const videoUrl = card.getAttribute("data-video");

            if (videoUrl) {
                videoFrame.src = videoUrl;
                videoModal.classList.remove("hidden");
                videoModal.classList.add("visible");
                document.body.classList.add("modal-open");
            } else {
                alert("No video available for this exercise.");
            }
        }

        if (e.target === closeVideoModal) {
            videoModal.classList.remove("visible");
            videoModal.classList.add("hidden");
            videoFrame.src = "";
            document.body.classList.remove("modal-open");
        }
    });
    document.getElementById("editCardForm").addEventListener("submit", async function (e) {
        e.preventDefault();
    
        const id = Number(document.getElementById("editExerciseId").value);
        const name = document.getElementById("editExerciseName").value;
        const category = document.getElementById("editExerciseCategory").value;
        const difficulty = document.getElementById("editExerciseDifficulty").value;
        const goal = document.getElementById("editExerciseGoal").value;
        const rawVideoLink = document.getElementById("editExerciseVideo").value;
        const videoLink = convertToEmbedURL(rawVideoLink);
        const pbText = document.getElementById("editExercisePBText").value.trim();

        const tags = [category, difficulty, goal];
        if (pbText) tags.push(`pb:${pbText}`);

    
        const updatedExercise = {
            id,
            name,
            category,
            difficulty,
            tags: tags ,
            videoURL: videoLink
        };
    
        try {
            const res = await fetch(`http://localhost:3000/api/exercises/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedExercise),
            });
            const updated = await res.json();
            const oldCard = document.querySelector(`.exercise-card[data-id='${id}']`);
            if (oldCard) oldCard.remove();
            addExerciseCardToDOM(updated);
            document.getElementById("editCardModal").classList.add("hidden");
        } catch (err) {
            console.error("Error updating exercise:", err);
        }
        

      
    });

    const closeEditModal = document.getElementById("closeEditModal");

    closeEditModal.addEventListener("click", () => {
        document.getElementById("editCardModal").classList.add("hidden");
    });

    
    

    
   
     
});
