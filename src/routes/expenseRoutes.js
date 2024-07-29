import express from 'express';
import * as expenseController from '../controllers/expenseController.js';
import auth from '../middlewares/authMiddleware.js';



const router = express.Router();

//These are the expense routes which includes the following:
//1. Add an expense
//2. Get all expenses of a user
//3. Get all expenses of all users
//4. Download balance sheet
//5. Get balances of a user


router.post('/addExpense',auth, expenseController.addExpense);
router.get('/user/:userId',auth,  expenseController.getUserExpenses);
router.get('/allExpenses', expenseController.getOverallExpenses);//haven't added auth middleware here as we want to get all expenses of all users
router.get('/balance-sheet', expenseController.downloadBalanceSheet);
router.get('/balances/:userId', auth, expenseController.getUserBalances);

export default router;