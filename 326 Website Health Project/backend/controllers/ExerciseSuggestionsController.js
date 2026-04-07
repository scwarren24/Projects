import Exercise from '../models/Exercise.js';

export async function getExercises(req, res) {
  try {
    const exercises = await Exercise.findAll();
    res.json(exercises);
  } catch (err) {
    console.error("Error retrieving exercises:", err);
    res.status(500).json({ error: "Failed to get exercises" });
  }
}

export async function getExerciseByIdHandler(req, res) {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ error: "Error fetching exercise" });
  }
}

export async function createExercise(req, res) {
  try {
    const newExercise = await Exercise.create(req.body);
    res.status(201).json(newExercise);
  } catch (err) {
    console.error("Error creating exercise:", err);
    res.status(500).json({ error: "Failed to add exercise" });
  }
}

export async function updateExerciseHandler(req, res) {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    await exercise.update(req.body);
    res.json(exercise);
  } catch (err) {
    console.error("Error updating exercise:", err);
    res.status(500).json({ error: "Failed to update exercise" });
  }
}

export async function deleteExerciseHandler(req, res) {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    await exercise.destroy();
    res.json({ message: "Exercise deleted" });
  } catch (err) {
    console.error("Error deleting exercise:", err);
    res.status(500).json({ error: "Failed to delete exercise" });
  }
}
