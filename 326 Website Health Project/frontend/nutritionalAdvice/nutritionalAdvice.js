document.addEventListener("DOMContentLoaded", async function () {
    const form = document.getElementById("nutritional-form");
    const goalWeightInput = document.getElementById("goal-weight-inpt");
    const curWeightInput = document.getElementById("weight-inpt");
    const activityLevelInput = document.getElementById("activity");
    const genderInput = document.getElementById("gender-inpt");
    const ageInput = document.getElementById("age-inpt");
    const heightInput = document.getElementById("height-inpt");
    const recommendationsDashboard = document.getElementById("reccomendations-dashboard");
    const weightChangeRateInput = document.getElementById("weight-change-rate");

    const errors = {
        age: document.getElementById("age-error"),
        height: document.getElementById("height-error"),
        weight: document.getElementById("weight-error"),
        goal: document.getElementById("goal-error"),
        gender: document.getElementById("gender-error"),
        activity: document.getElementById("activity-error"),
        rate: document.getElementById("rate-error")
    };

    try {
        const res = await fetch("/api/nutrition");
        if (res.ok) {
            const saved = await res.json();
            goalWeightInput.value = saved.goalWeight;
            curWeightInput.value = saved.weight;
            ageInput.value = saved.age;
            heightInput.value = saved.height;
            genderInput.value = saved.gender;
            activityLevelInput.value = saved.activityLevel;
            weightChangeRateInput.value = saved.weightChangeRate;
        }
    } catch (err) {
        console.warn("No saved nutrition data from backend:", err.message);
    }

    let macrosChart;
    function renderChart(proteinGrams, fatGrams, carbGrams) {
        const ctx = document.getElementById('macrosChart').getContext('2d');
        if (macrosChart) macrosChart.destroy();
        macrosChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Protein (g)', 'Fats (g)', 'Carbs (g)'],
                datasets: [{
                    data: [proteinGrams, fatGrams, carbGrams],
                    backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    title: { display: true, text: 'Macronutrient Breakdown' }
                }
            }
        });
    }

    const toggleViewBtn = document.getElementById("toggle-view");
    toggleViewBtn.addEventListener("click", () => {
        const chartContainer = document.getElementById("chart-container");
        const recDashboard = document.getElementById("reccomendations-dashboard");
        const isChartVisible = chartContainer.style.display === "block";
        chartContainer.style.display = isChartVisible ? "none" : "block";
        recDashboard.style.display = isChartVisible ? "block" : "none";
        toggleViewBtn.textContent = isChartVisible
            ? "Switch to Graph View"
            : "Switch to Text View";
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        Object.values(errors).forEach(el => el.textContent = "");

        const goalWeight = goalWeightInput.value;
        const age = ageInput.value;
        const height = heightInput.value;
        const weight = curWeightInput.value;
        const gender = genderInput.value;
        const activityLevel = activityLevelInput.value;
        const weightChangeRate = parseFloat(weightChangeRateInput.value);

        let hasError = false;
        if (!age || age <= 0) { errors.age.textContent = "Please enter a valid age."; hasError = true; }
        if (!height || height <= 0) { errors.height.textContent = "Please enter a valid height."; hasError = true; }
        if (!weight || weight <= 0) { errors.weight.textContent = "Please enter a valid weight."; hasError = true; }
        if (!goalWeight || goalWeight <= 0) { errors.goal.textContent = "Please enter a valid goal weight."; hasError = true; }
        if (!gender) { errors.gender.textContent = "Please select your gender."; hasError = true; }
        if (!activityLevel) { errors.activity.textContent = "Please select your activity level."; hasError = true; }
        if (!weightChangeRate) {errors.rate.textContent = "Please select a desired weekly weight change."; hasError = true }

        if (hasError) {
            recommendationsDashboard.innerHTML = `<p>Please fix the errors above to see recommendations.</p>`;
            return;
        }

        const userInputs = {
            goalWeight,
            weight,
            age,
            height,
            gender,
            activityLevel,
            weightChangeRate
        };

        try {
            await fetch("/api/nutrition", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInputs),
            });
        } catch (err) {
            console.error("Error saving to backend:", err);
        }

        let BMR;
        if (gender === "male") {
            BMR = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
        } else {
            BMR = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
        }
        BMR *= 0.9;

        let activityMultiplier = 1.1;
        if (activityLevel === "medium") activityMultiplier = 1.3;
        else if (activityLevel === "high") activityMultiplier = 1.5;

        let goalTDEE = BMR * activityMultiplier;

        const calorieAdjustment = weightChangeRate * 3000 / 7; // daily adjustment
        const totalCalories = Math.round(goalTDEE - calorieAdjustment);

        let proteinGrams = Math.round(goalWeight * 1.2);
        let fatGrams = Math.round(totalCalories * 0.25 / 9);
        let carbGrams = Math.round((totalCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4);

        recommendationsDashboard.innerHTML = `
            <p>Based on your goal weight of ${goalWeight} lbs:</p>
            <p>Total Daily Calories: ${totalCalories}</p>
            <p>${proteinGrams} grams of protein per day</p>
            <p>${fatGrams} grams of fats per day</p>
            <p>${carbGrams} grams of carbs per day</p>
        `;

        renderChart(proteinGrams, fatGrams, carbGrams);
    });

    const resetBtn = document.getElementById("reset-btn");
    resetBtn.addEventListener("click", async function () {
        form.reset();

        Object.values(errors).forEach(el => el.textContent = "");

        recommendationsDashboard.innerHTML = `
            <p>Based on your goal weight of __ lbs:</p>
            <p>Total Daily Calories: __</p>
            <p>__ grams of protein per day</p>
            <p>__ grams of fats per day</p>
            <p>__ grams of carbs per day</p>
        `;

        document.getElementById("chart-container").style.display = "none";
        recommendationsDashboard.style.display = "block";
        toggleViewBtn.textContent = "Switch to Graph View";

        try {
            const res = await fetch("/api/nutrition", { method: "DELETE" });
            const result = await res.json();
            console.log("Nutrition data cleared:", result.message);
        } catch (err) {
            console.error("Error deleting nutrition data from backend:", err);
        }
    });
});
