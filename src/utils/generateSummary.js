/**
 * Generate a 30-day summary of income and expenses
 * @param {Object} income - Income object with amount and history
 * @param {Array} expenses - Array of expense objects
 * @param {number} spendingLimit - Daily spending limit
 * @returns {Object} - Summary object
 */
export const generateSummary = (income, expenses, spendingLimit) => {
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    // Calculate category breakdown
    const categoryData = expenses.reduce((acc, expense) => {
        const category = expense.category || 'Other';
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount || 0);
        return acc;
    }, {});

    // Calculate overshoot days (days where spending exceeded limit)
    const expensesByDate = {};
    expenses.forEach(expense => {
        const date = new Date(expense.date).toDateString();
        expensesByDate[date] = (expensesByDate[date] || 0) + parseFloat(expense.amount || 0);
    });

    const overshootDays = Object.values(expensesByDate).filter(
        dailyTotal => dailyTotal > spendingLimit
    ).length;

    // Calculate daily average
    const uniqueDays = Object.keys(expensesByDate).length;
    const dailyAverage = uniqueDays > 0 ? totalExpenses / uniqueDays : 0;

    return {
        date: new Date().toISOString(),
        totalIncome: income.amount,
        totalExpenses,
        balance: income.amount - totalExpenses,
        categoryData,
        expenseCount: expenses.length,
        overshootDays,
        dailyAverage,
        period: '30 days'
    };
};

/**
 * Check if 30 days have passed since start date
 * @param {string} startDate - ISO date string
 * @param {number} summaryCount - Number of summaries already generated
 * @returns {boolean} - Whether to generate summary
 */
export const shouldGenerateSummary = (startDate, summaryCount) => {
    const start = new Date(startDate);
    const now = new Date();
    const daysDiff = Math.floor((now - start) / (1000 * 60 * 60 * 24));

    // Generate summary every 30 days
    const expectedSummaries = Math.floor(daysDiff / 30);
    return expectedSummaries > summaryCount;
};
