import Expense from '../models/Expense.js';
import User from '../models/User.js';
import { validateExpense } from '../utils/validation.js';
import { generateBalanceSheet } from '../utils/balanceSheet.js';

export const addExpense = async (req, res) => {
  try {
    const { error } = validateExpense(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { paidBy, participants, amount, splitMethod } = req.body;


    
    // Validate shares based on splitMethod
    if (splitMethod === 'equal') {
      participants.forEach(participant => {
        participant.share = amount / participants.length;
      });
    } else if (splitMethod === 'exact' || splitMethod === 'percentage') {
      let totalShare = 0;
      
      for (let participant of participants) {
        if (!participant.share) {
          return res.status(400).json({ message: `Share is required for participant ${participant.user} when splitMethod is ${splitMethod}` });
        }
        totalShare += participant.share;
      }
      
      if (splitMethod === 'percentage') {
        if (Math.abs(totalShare - 100) > 0.01) { // Using 0.01 to account for floating point precision
          return res.status(400).json({ message: 'Total percentage must add up to 100%' });
        }
        // Convert percentages to actual amounts
        participants.forEach(participant => {
          participant.share = (participant.share / 100) * amount;
        });
      } else { // splitMethod === 'exact'
        if (Math.abs(totalShare - amount) > 0.01) { // Using 0.01 to account for floating point precision
          return res.status(400).json({ message: `Total of shares must add up to the total amount (${amount})` });
        }
      }
    } else {
      return res.status(400).json({ message: 'Invalid split method' });
    }

    const newExpense = new Expense(req.body);
    await newExpense.save();

    // Update lends and debts for users
    const paidByUser = await User.findById(paidBy);
    
    for (let participant of participants) {
      const participantUser = await User.findById(participant.user);
      let share = 0;

      if (splitMethod === 'equal') {
        share = amount / participants.length;
      } else if (splitMethod === 'exact' ) {
        share = participant.share;
      }
      else if(splitMethod === 'percentage'){
        share = amount * (participant.share / 100);
      }

      if (participantUser._id.toString() !== paidByUser._id.toString()) {
        // Update paidBy user's lends
        const lendIndex = paidByUser.lends.findIndex(lend => lend.user.toString() === participantUser._id.toString());
        if (lendIndex !== -1) {
          paidByUser.lends[lendIndex].amount += share;
        } else {
          paidByUser.lends.push({ user: participantUser._id, amount: share });
        }

        // Update participant's debts
        const debtIndex = participantUser.debts.findIndex(debt => debt.user.toString() === paidByUser._id.toString());
        if (debtIndex !== -1) {
          participantUser.debts[debtIndex].amount += share;
        } else {
          participantUser.debts.push({ user: paidByUser._id, amount: share });
        }

        await participantUser.save();
      }
    }

    await paidByUser.save();

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

export const getUserBalances = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .populate('lends.user', 'name')
      .populate('debts.user', 'name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const balances = {
      lends: user.lends.map(lend => ({
        user: lend.user.name,
        amount: lend.amount,
      })),
      debts: user.debts.map(debt => ({
        user: debt.user.name,
        amount: debt.amount,
      })),
    };

    res.json(balances);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user balances', error: error.message });
  }
};