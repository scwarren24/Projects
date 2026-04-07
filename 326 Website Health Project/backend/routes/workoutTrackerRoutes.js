import express from "express";

import { getAllWorkouts,getWorkoutById, addWorkout, deleteWorkout } from "../controllers/workoutTrackerController.js";

const router = express.Router();

router.get('/', getAllWorkouts);
router.get('/', getWorkoutById);
router.post('/', addWorkout);
router.delete('/', deleteWorkout);


// class workoutTrackerRoutes {
//     constructor(workoutTrackerController) {
//         this.router = express.Router();
//         this.workoutTrackerController = workoutTrackerController;
//         this.initializeRoutes();
//     }
    
//     initializeRoutes() {
//         this.router.post("/workout", async (req, res) => {
//         //this.workoutTrackerController.createWorkout(req, res)
//         await workoutTrackerController.addWorkout(req, res);
//         });
//         this.router.get("/workout", async (req, res) => {
//         //this.workoutTrackerController.getAllWorkouts(req, res)
//         await workoutTrackerController.getAllWorkouts(req, res);
//         });
//         this.router.get("/workout/:id", (req, res) =>
//         this.workoutTrackerController.getWorkoutById(req, res)
//         );
//         // this.router.put("/workout/:id", (req, res) =>
//         // this.workoutTrackerController.updateWorkout(req, res)
//         // );
//         // this.router.delete("/workout/:id", (req, res) =>
//         // this.workoutTrackerController.deleteWorkout(req, res)
//         // );
//     }
//     getRouter() {
//         return this.router;
//     }
// }

export default router;
//export default new workoutTrackerRoutes();