import workoutTrackerDB from "../models/workoutTrackerModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//const DataPath = path.join(__dirname, '../data/workoutTrackerData.json');

export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await workoutTrackerDB.findAll();
    res.json(workouts);
  } catch (error) {
    console.error("Error fetching all data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getWorkoutById = async (req, res) => {
  try {
    const workouts = await workoutTrackerDB.findByPk(req.params.id);
    if (!workouts) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json(workouts);
  } catch (error) {
    console.error("Error fetching workout by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const addWorkout = async (req, res) => {
  try {
    const newWorkout = await workoutTrackerDB.create(req.body);
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error("Error adding workout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  // try {
  //   if (!fs.existsSync(DataPath)) {
  //     return res.status(404).json({ message: "No workouts found" });
  //   }
  //   const data = fs.readFileSync(DataPath, "utf8");
  //   const workouts = JSON.parse(data);
  //   const newWorkout = {
  //     id: Date.now().toString(),
  //     ...req.body,
  //   };
  //   workouts.push(newWorkout);
  //   fs.writeFileSync(DataPath, JSON.stringify(workouts, null, 2), "utf8");
  //   res.status(201).json(newWorkout);
  // } catch (error) {
  //   console.error("Error adding workout:", error);
  //   res.status(500).json({ message: error.message });
  // }
}

export const deleteWorkout = async (req, res) => {
  try {
    const workout = await workoutTrackerDB.findByPk(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    await workout.destroy();
    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  // try {
  //   if (!fs.existsSync(DataPath)) {
  //     return res.status(404).json({ message: "No workouts found" });
  //   }
  //   const data = fs.readFileSync(DataPath, "utf8");
  //   const workouts = JSON.parse(data);
  //   const workoutIndex = workouts.findIndex((w) => w.id === req.params.id);
  //   if (workoutIndex === -1) {
  //     return res.status(404).json({ message: "Workout not found" });
  //   }
  //   workouts.splice(workoutIndex, 1);
  //   fs.writeFileSync(DataPath, JSON.stringify(workouts, null, 2), "utf8");
  //   res.status(200).json({ message: "Workout deleted successfully" });
  // } catch (error) {
  //   console.error("Error deleting workout:", error);
  //   res.status(500).json({ message: error.message });
  // }
}

// function getAllWorkouts(req, res) {
//   if (!fs.existsSync(DataPath)) {
//     return res.status(404).json({ message: "No workouts found" });
//   }
//   const data = fs.readFileSync(DataPath, "utf8");
//   const workouts = JSON.parse(data);
//   res.status(200).json(workouts);
// }
// function getWorkoutById(req, res) {
//   if (!fs.existsSync(DataPath)) {
//     return res.status(404).json({ message: "No workouts found" });
//   }
//   const data = fs.readFileSync(DataPath, "utf8");
//   const workouts = JSON.parse(data);
//   const workout = workouts.find((w) => w.id === req.params.id);
//   if (!workout) {
//     return res.status(404).json({ message: "Workout not found" });
//   }
//   res.status(200).json(workout);
// }
// function addWorkout(req, res) {
//   if (!fs.existsSync(DataPath)) {
//     return res.status(404).json({ message: "No workouts found" });
//   }
//   const data = fs.readFileSync(DataPath, "utf8");
//   const workouts = JSON.parse(data);
//   const newWorkout = {
//     id: Date.now().toString(),
//     ...req.body,
//   };
//   workouts.push(newWorkout);
//   fs.writeFileSync(DataPath, JSON.stringify(workouts, null, 2), "utf8");
//   res.status(201).json(newWorkout);
// }
// function deleteWorkout(req, res) {
//   if (!fs.existsSync(DataPath)) {
//     return res.status(404).json({ message: "No workouts found" });
//   }
//   const data = fs.readFileSync(DataPath, "utf8");
//   const workouts = JSON.parse(data);
//   const workoutIndex = workouts.findIndex((w) => w.id === req.params.id);
//   if (workoutIndex === -1) {
//     return res.status(404).json({ message: "Workout not found" });
//   }
//   workouts.splice(workoutIndex, 1);
//   fs.writeFileSync(DataPath, JSON.stringify(workouts, null, 2), "utf8");
//   res.status(200).json({ message: "Workout deleted successfully" });
// }

class workoutTrackerController {
  constructor(workoutTrackerService) {
    this.workoutTrackerService = workoutTrackerService;
  }

  // async getAllWorkouts(req, res) {
  //   try {
  //     const workouts = await this.workoutTrackerService.getAllWorkouts();
  //     res.status(200).json(workouts);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }

  // async getWorkoutById(req, res) {
  //   try {
  //     const workout = await this.workoutTrackerService.getWorkoutById(req.params.id);
  //     if (!workout) {
  //       return res.status(404).json({ message: 'Workout not found' });
  //     }
  //     res.status(200).json(workout);
  //   } catch (error) {
  //       console.error("Error adding task:", error);
  //     res.status(500).json({ message: error.message });
  //   }
  // }
  // async addWorkout(req, res) {
  //   try {
  //     const workout = await this.workoutTrackerService.addWorkout(req.body);
  //     res.status(201).json(workout);
  //   } catch (error) {
  //       console.error("Error adding task:", error);
  //     res.status(500).json({ message: error.message });
  //   }
  // }
  // async deleteWorkout(req, res) {
  //   try {
  //     const workout = await this.workoutTrackerService.deleteWorkout(req.params.id);
  //     if (!workout) {
  //       return res.status(404).json({ message: 'Workout not found' });
  //     }
  //     res.status(200).json(workout);
  //   } catch (error) {
  //       console.error("Error adding task:", error);
  //     res.status(500).json({ message: error.message });
  //   }
  // }
}

// export { getAllWorkouts, getWorkoutById, addWorkout, deleteWorkout}; 