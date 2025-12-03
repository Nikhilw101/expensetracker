import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateSummary, shouldGenerateSummary } from '../utils/generateSummary';
import { calculateCurrentBalance } from '../utils/calculateBalance';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // State management using localStorage
    const [income, setIncome] = useLocalStorage('userIncome', {
        amount: 0,
        startDate: new Date().toISOString(),
        history: []
    });

    const [expenses, setExpenses] = useLocalStorage('dailyExpenses', []);
    const [spendingLimit, setSpendingLimit] = useLocalStorage('spendingLimit', 200);
    const [summaryHistory, setSummaryHistory] = useLocalStorage('summaryHistory', []);
    const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

    // Toast notification state
    const [toastState, setToastState] = useState({ show: false, message: '', type: '' });

    // Toast notification helper
    const showToast = (message, type = 'success') => {
        setToastState({ show: true, message, type });
        setTimeout(() => setToastState({ show: false, message: '', type: '' }), 3000);
    };

    // Income management
    const addIncome = (amount) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            showToast('Invalid amount. Please enter a positive number.', 'error');
            return false;
        }

        const newEntry = {
            amount: numAmount,
            date: new Date().toISOString()
        };

        const updatedIncome = {
            amount: income.amount + numAmount,
            startDate: income.startDate,
            history: [...income.history, newEntry]
        };

        setIncome(updatedIncome);
        showToast('Income added successfully!');
        return true;
    };

    const updateIncome = (newAmount) => {
        const numAmount = parseFloat(newAmount);
        if (isNaN(numAmount) || numAmount < 0) {
            showToast('Invalid amount', 'error');
            return false;
        }

        setIncome({ ...income, amount: numAmount });
        showToast('Income updated!');
        return true;
    };

    const editIncomeHistoryItem = (index, newAmount) => {
        const numAmount = parseFloat(newAmount);
        if (isNaN(numAmount) || numAmount <= 0) {
            showToast('Invalid amount', 'error');
            return false;
        }

        const oldItem = income.history[index];
        if (!oldItem) {
            showToast('Income item not found', 'error');
            return false;
        }

        const diff = numAmount - oldItem.amount;

        const updatedHistory = [...income.history];
        updatedHistory[index] = { ...oldItem, amount: numAmount };

        const updatedIncome = {
            ...income,
            amount: income.amount + diff,
            history: updatedHistory
        };

        setIncome(updatedIncome);
        showToast('Income updated successfully!');
        return true;
    };

    // Expense management
    const addExpense = (expenseData) => {
        const numAmount = parseFloat(expenseData.amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            showToast('Invalid amount. Please enter a positive number.', 'error');
            return false;
        }

        const newExpense = {
            ...expenseData,
            amount: numAmount,
            id: Date.now(),
            date: expenseData.date || new Date().toISOString()
        };

        setExpenses([...expenses, newExpense]);
        showToast('Expense added successfully!');
        return true;
    };

    const updateExpense = (id, updatedData) => {
        const numAmount = parseFloat(updatedData.amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            showToast('Invalid amount. Please enter a positive number.', 'error');
            return false;
        }

        setExpenses(expenses.map(e =>
            e.id === id ? { ...updatedData, id, amount: numAmount } : e
        ));
        showToast('Expense updated successfully!');
        return true;
    };

    const deleteExpense = (id) => {
        setExpenses(expenses.filter(e => e.id !== id));
        showToast('Expense deleted!', 'error');
    };

    // Spending limit management
    const updateSpendingLimit = (newLimit) => {
        const numLimit = parseFloat(newLimit);
        if (isNaN(numLimit) || numLimit <= 0) {
            showToast('Invalid limit. Please enter a positive number.', 'error');
            return false;
        }

        setSpendingLimit(numLimit);
        showToast('Spending limit updated successfully!');
        return true;
    };

    // Balance calculation
    const getCurrentBalance = () => {
        return calculateCurrentBalance(income.amount, expenses);
    };

    // Summary generation
    const checkAndGenerateSummary = () => {
        if (shouldGenerateSummary(income.startDate, summaryHistory.length)) {
            const summary = generateSummary(income, expenses, spendingLimit);
            setSummaryHistory([...summaryHistory, summary]);
            showToast('30-day summary generated!', 'success');
        }
    };

    const manualGenerateSummary = () => {
        const summary = generateSummary(income, expenses, spendingLimit);
        setSummaryHistory([...summaryHistory, summary]);
        showToast('Summary generated successfully!', 'success');
    };

    // Auto-generate summary when expenses change
    useEffect(() => {
        if (expenses.length > 0) {
            checkAndGenerateSummary();
        }
    }, [expenses.length]);

    // Apply dark mode to document
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const contextValue = {
        // State
        income,
        expenses,
        spendingLimit,
        summaryHistory,
        darkMode,
        toastState,

        // Income functions
        addIncome,
        updateIncome,
        editIncomeHistoryItem,

        // Expense functions
        addExpense,
        updateExpense,
        deleteExpense,

        // Limit functions
        updateSpendingLimit,

        // Utility functions
        getCurrentBalance,
        manualGenerateSummary,

        // UI functions
        setDarkMode,
        showToast
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the app context
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export default AppContext;
