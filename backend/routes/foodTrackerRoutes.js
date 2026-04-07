import express from 'express';
import {
  getAllData,
  getDataById,
  addData,
  
  deleteData
} from '../controllers/foodTrackerController.js';

const router = express.Router();

router.get('/', getAllData);
router.get('/:userId', getDataById);

router.post('/', addData);

router.delete('/:userId/:foodId', deleteData);



export default router;