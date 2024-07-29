export const generateBalanceSheet = (expenses) => {
    // Implemented the balance sheet generation logic here
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