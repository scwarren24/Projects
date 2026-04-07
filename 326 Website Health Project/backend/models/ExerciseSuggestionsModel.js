import { v4 as uuidv4 } from 'uuid';
import Exercise from '../models/Exercise.js';

export async function getAllExercises() {
  return await Exercise.findAll();
}

export async function getExerciseById(id) {
  return await Exercise.findByPk(id);
}

export async function addExercise(exercise) {
  const newExercise = await Exercise.create({
    id: uuidv4(),
    name: exercise.name,
    category: exercise.category,
    difficulty: exercise.difficulty,
    tags: exercise.tags
  });
  return newExercise;
}

export async function updateExercise(id, updatedExercise) {
  const exercise = await Exercise.findByPk(id);
  if (!exercise) return null;
  await exercise.update(updatedExercise);
  return exercise;
}

export async function deleteExercise(id) {
  const exercise = await Exercise.findByPk(id);
  if (!exercise) return null;
  await exercise.destroy();
  return exercise;
}
