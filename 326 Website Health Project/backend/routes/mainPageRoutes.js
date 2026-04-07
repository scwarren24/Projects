import express from "express"
import { getProfile, saveProfile, deleteProfile } from "../controllers/mainPageController.js";

const router = express.Router();

router.get("/", getProfile);
router.post("/", saveProfile);
router.delete("/", deleteProfile);

export default router;