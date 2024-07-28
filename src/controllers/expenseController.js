import Expense from '../models/Expense.js';
import { validateExpense } from '../utils/validation.js';
import { generateBalanceSheet } from '../utils/balanceSheet.js';

export const addExpense = async (req, res) => {
  try {
    const { error } = validateExpense(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newExpense = new Expense(req.body);
    await newExpense.save();

    res.status(201).json({ message: 'Expense added successfully', expenseId: newExpense._id });
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error: error.message });
  }
};

export const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ 'participants.user': req.params.userId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user expenses', error: error.message });
  }
};

export const getOverallExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('paidBy', 'name');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving overall expenses', error: error.message });
  }
};

export const downloadBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('paidBy', 'name').populate('participants.user', 'name');
    const balanceSheet = generateBalanceSheet(expenses);
    res.json(balanceSheet);
  } catch (error) {
    res.status(500).json({ message: 'Error generating balance sheet', error: error.message });
  }
};