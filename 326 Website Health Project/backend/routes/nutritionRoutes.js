import express from "express";
import { getNutritionData, saveNutritionData, deleteNutritionData } from "../controllers/nutritionController.js";

const router = express.Router();

router.get("/", getNutritionData);
router.post("/", saveNutritionData);
router.delete("/", deleteNutritionData);

export default router;