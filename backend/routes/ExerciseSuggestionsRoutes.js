import express from 'express';
import {
  getExercises,
  getExerciseByIdHandler,
  createExercise,
  updateExerciseHandler,
  deleteExerciseHandler
} from '../controllers/ExerciseSuggestionsController.js';

const router = express.Router();

router.get('/', getExercises);
router.get('/:id', getExerciseByIdHandler);
router.post('/', createExercise);
router.put('/:id', updateExerciseHandler);
router.delete('/:id', deleteExerciseHandler);

export default router;
