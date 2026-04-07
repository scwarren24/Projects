import { EventHub } from "../eventhub/EventHub.js";
import { Events } from "../eventhub/Events.js";

console.log("mainPage.js loaded");

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".account-form");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");
    const goalWeightInput = document.getElementById("goal-weight");
    const dobInput = document.getElementById("dob");
    const genderInput = document.getElementById("gender");
    const activityLevelInput = document.getElementById("activity-level");

    const editButton = document.getElementById("edit-button");
    const saveButton = document.getElementById("save-button");

    const errors = {
        name: document.getElementById("name-error"),
        email: document.getElementById("email-error"),
        height: document.getElementById("height-error"),
        weight: document.getElementById("weight-error"),
        goal: document.getElementById("goal-error"),
        dob: document.getElementById("dob-error"),
        gender: document.getElementById("gender-error"),
        activity: document.getElementById("activity-error")
    };

    // Load saved data if it exists
    const savedData = JSON.parse(localStorage.getItem("accountInfo"));
    if (savedData) {
        nameInput.value = savedData.name || "";
        emailInput.value = savedData.email || "";
        heightInput.value = savedData.height || "";
        weightInput.value = savedData.weight || "";
        goalWeightInput.value = savedData.goalWeight || "";
        dobInput.value = savedData.dob || "";
        genderInput.value = savedData.gender || "";
        activityLevelInput.value = savedData.activityLevel || "";
    }

    (async function loadUserProfile() {
        try {
            const res = await fetch("/api/mainPage");
            if (!res.ok) {
                throw new Error("Failed to load profile");
            }
            const profile = await res.json();

            nameInput.value = profile.name || "";
            emailInput.value = profile.email || "";
            heightInput.value = profile.height || "";
            weightInput.value = profile.weight || "";
            goalWeightInput.value = profile.goalWeight || "";
            dobInput.value = profile.dob || "";
            genderInput.value = profile.gender || "";
            activityLevelInput.value = profile.activityLevel || "";
        } catch (err) {
            console.warn("No profile loaded from backend:", err.message);
        }
    })();
    
    editButton.addEventListener("click", () => {
        [nameInput, emailInput, heightInput, weightInput, goalWeightInput, dobInput].forEach(input => input.readOnly = false);
        [genderInput, activityLevelInput].forEach(select => select.disabled = false);
        saveButton.disabled = false;
    });

    function validateField(inputEl, errorEl, type = "text") {
        const value = inputEl.value.trim();
        errorEl.textContent = "";

        if (type === "email") {
            if (!value) {
                errorEl.textContent = "Email is required.";
                return false;
            } else if (!/^\S+@\S+\.\S+$/.test(value)) {
                errorEl.textContent = "Please enter a valid email.";
                return false;
            }
        } else if (type === "number") {
            if (!value || isNaN(value) || Number(value) <= 0) {
                errorEl.textContent = "Please enter a valid positive number.";
                return false;
            }
        } else if (type === "date") {
            if (!value) {
                errorEl.textContent = "Date of birth is required.";
                return false;
            }
        } else if (type === "select") {
            if (!value) {
                errorEl.textContent = "Please select a value.";
                return false;
            }
        } else {
            if (!value) {
                errorEl.textContent = "This field is required.";
                return false;
            }
        }

        return true;
    }

    // Attach live validation to fields
    nameInput.addEventListener("input", () => validateField(nameInput, errors.name));
    emailInput.addEventListener("input", () => validateField(emailInput, errors.email, "email"));
    heightInput.addEventListener("input", () => validateField(heightInput, errors.height, "number"));
    weightInput.addEventListener("input", () => validateField(weightInput, errors.weight, "number"));
    goalWeightInput.addEventListener("input", () => validateField(goalWeightInput, errors.goal, "number"));
    dobInput.addEventListener("input", () => validateField(dobInput, errors.dob, "date"));
    genderInput.addEventListener("change", () => validateField(genderInput, errors.gender, "select"));
    activityLevelInput.addEventListener("change", () => validateField(activityLevelInput, errors.activity, "select"));

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const validName = validateField(nameInput, errors.name);
        const validEmail = validateField(emailInput, errors.email, "email");
        const validHeight = validateField(heightInput, errors.height, "number");
        const validWeight = validateField(weightInput, errors.weight, "number");
        const validGoal = validateField(goalWeightInput, errors.goal, "number");
        const validDOB = validateField(dobInput, errors.dob, "date");
        const validGender = validateField(genderInput, errors.gender, "select");
        const validActivity = validateField(activityLevelInput, errors.activity, "select");

        if (!(validName && validEmail && validHeight && validWeight && validGoal && validDOB && validGender && validActivity)) {
            return;
        }

        const accountInfo = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            height: heightInput.value.trim(),
            weight: weightInput.value.trim(),
            goalWeight: goalWeightInput.value.trim(),
            dob: dobInput.value.trim(),
            gender: genderInput.value,
            activityLevel: activityLevelInput.value
        };

        localStorage.setItem("accountInfo", JSON.stringify(accountInfo));

        (async function saveUserProfile() {
            try {
                const res = await fetch("/api/mainPage", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(accountInfo),
                });
                const result = await res.json();
                console.log(result.message);
            } catch (err) {
                console.error("Error saving profile:", err);
            }
        })();
        EventHub.getInstance().publish(Events.StoreProfile, accountInfo);

        [nameInput, emailInput, heightInput, weightInput, goalWeightInput, dobInput].forEach(input => input.readOnly = true);
        [genderInput, activityLevelInput].forEach(select => select.disabled = true);
        saveButton.disabled = true;
    });
});
