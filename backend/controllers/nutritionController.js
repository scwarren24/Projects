import SQLiteNutritionModel from "../models/nutritionModel.js";

async function getNutritionData(req, res) {
    try {
        const records = await SQLiteNutritionModel.read();
        if (records.length === 0) {
            return res.status(404).json({ message: "No nutrition data found" });
        }
        res.json(records[records.length - 1]);
    } catch (err) {
        console.error("Error fetching nutrition data:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function saveNutritionData(req, res) {
    try {
        const nutrition = req.body;
        const requiredFields = ["age", "weight", "height", "gender", "activityLevel", "goalWeight", "weightChangeRate"];
        const missing = requiredFields.filter(field => !(field in nutrition));

        if (missing.length > 0) {
            return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}`});
        }

        await SQLiteNutritionModel.create(nutrition);
        res.json({ message: "Nutrition data saved" });
    } catch (err) {
        console.error("Error saving nutrition data:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteNutritionData(req, res) {
    try {
        await SQLiteNutritionModel.delete();
        res.json({ message: "All nutrition data deleted" });
      } catch (err) {
        console.error("Error deleting nutrition data:", err);
        res.status(500).json({ message: "Internal server error" });
      }
}

export { getNutritionData, saveNutritionData, deleteNutritionData };