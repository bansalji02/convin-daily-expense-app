export const generateBalanceSheet = (expenses) => {
    // Implement the balance sheet generation logic here
    // This is a placeholder implementation
    return expenses.map(expense => ({
      description: expense.description,
      amount: expense.amount,
      paidBy: expense.paidBy.name,
      participants: expense.participants.map(p => ({
        name: p.user.name,
        share: p.share,
      })),
    }));
  };