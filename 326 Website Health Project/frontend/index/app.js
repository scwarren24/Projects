import { UserProfileRepositoryFactory } from '../service/UserProfileRepositoryFactory.js';

const profileRepo = UserProfileRepositoryFactory.get("local");


document.addEventListener("DOMContentLoaded", () => {
    function navigate(viewId) {
        const allViews = document.querySelectorAll(".view > div");
        allViews.forEach((view) => {
            if (view) {
                view.style.display = "none";
            }
        });

        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.style.display = "block";
            
            const mainContent = document.getElementById("main-content");
            if (mainContent) {
                mainContent.style.height = targetView.offsetHeight + "px";
            }
        } else {
            console.warn(`View ID "${viewId}" not found`);
        }

        if (viewId === "main-page" || viewId === "nutritional-advice") {
          const profileRepo = UserProfileRepositoryFactory.get("local");
          if (profileRepo.loadProfileFromDB) {
              profileRepo.loadProfileFromDB();
          }
        }

        if (["main-page", "nutritional-advice"].includes(viewId)) {
          profileRepo.ready.then(() => profileRepo.loadProfileFromDB());
      }      
      
      
    }

    const navMap = {
        "main": "main-page",
        "food": "food-tracker",
        "work": "workouts",
        "nutrition": "nutritional-advice",
        "workTrack": "workout-tracker"
    };

    Object.entries(navMap).forEach(([buttonId, viewId]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener("click", () => navigate(viewId));
        } else {
            console.warn(`Navigation button with ID "${buttonId}" not found`);
        }
    });

    navigate("main-page"); // Default view
});
