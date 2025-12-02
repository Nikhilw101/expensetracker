/**
 * Calculate current balance from income and expenses
 * @param {number} totalIncome - Total income amount
 * @param {Array} expenses - Array of expense objects
 * @returns {number} - Current balance
 */
export const calculateCurrentBalance = (totalIncome, expenses) => {
    const totalExpenses = expenses.reduce((sum, expense) => {
        const amount = parseFloat(expense.amount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return totalIncome - totalExpenses;
};

/**
 * Calculate total expenses from expense array
 * @param {Array} expenses - Array of expense objects
 * @returns {number} - Total expenses
 */
export const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((sum, expense) => {
        const amount = parseFloat(expense.amount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
};

/**
 * Get expenses for a specific date
 * @param {Array} expenses - Array of expense objects
 * @param {Date} date - Target date
 * @returns {Array} - Filtered expenses
 */
export const getExpensesByDate = (expenses, date) => {
    return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.toDateString() === date.toDateString();
    });
};

/**
 * Get expenses within a date range
 * @param {Array} expenses - Array of expense objects
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} - Filtered expenses
 */
export const getExpensesByDateRange = (expenses, startDate, endDate) => {
    return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
    });
};
