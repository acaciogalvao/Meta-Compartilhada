import { Router } from 'express';
import {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  addPaymentToGoal,
  getGoalProgress
} from '../controllers/goalController.js';

const router = Router();

// Rotas de CRUD
router.get('/', getAllGoals);
router.get('/:id', getGoalById);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

// Rotas específicas
router.post('/:id/payments', addPaymentToGoal);
router.get('/:id/progress', getGoalProgress);

export default router;
