import express from 'express';
import * as expenseController from '../controllers/expenseController.js';
import auth from '../middlewares/authMiddleware.js';



const router = express.Router();

router.post('/addExpense',auth, expenseController.addExpense);
router.get('/user/:userId', expenseController.getUserExpenses);
router.get('/allExpenses', expenseController.getOverallExpenses);
router.get('/balance-sheet', expenseController.downloadBalanceSheet);
router.get('/balances/:userId', expenseController.getUserBalances);

export default router;