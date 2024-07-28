import express from 'express';
import * as expenseController from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', expenseController.addExpense);
router.get('/user/:userId', expenseController.getUserExpenses);
router.get('/overall', expenseController.getOverallExpenses);
router.get('/balance-sheet', expenseController.downloadBalanceSheet);

export default router;