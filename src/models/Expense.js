import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  splitMethod: {
    type: String,
    enum: ['equal', 'exact', 'percentage'],
    required: true,
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    share: Number,
  }],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Expense', expenseSchema);