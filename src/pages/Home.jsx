import React from 'react';
import { useApp } from '../contexts/AppContext';
import LimitProgressCircle from '../components/LimitProgressCircle';

const Home = () => {
    const { income, expenses, spendingLimit, getCurrentBalance, darkMode } = useApp();

    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const balance = getCurrentBalance();

    const todayExpenses = expenses
        .filter(e => new Date(e.date).toDateString() === new Date().toDateString())
        .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    const last7Days = expenses
        .filter(e => {
            const expenseDate = new Date(e.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return expenseDate >= weekAgo;
        })
        .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    return (
        <div className="pb-20 px-4 pt-6">
            <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Dashboard
            </h1>

            <div className={`${darkMode ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'} rounded-3xl p-6 mb-6 shadow-xl`}>
                <p className="text-white text-sm opacity-90 mb-1">Current Balance</p>
                <h2 className="text-white text-5xl font-bold mb-4">₹{balance.toFixed(2)}</h2>
                <div className="flex justify-between text-white text-sm">
                    <div>
                        <p className="opacity-75">Income</p>
                        <p className="font-semibold">₹{income.amount.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                        <p className="opacity-75">Expenses</p>
                        <p className="font-semibold">₹{totalExpenses.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Today's Spending
                </h3>
                <LimitProgressCircle
                    currentSpending={todayExpenses}
                    limit={spendingLimit}
                    darkMode={darkMode}
                />
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Last 7 Days
                </h3>
                <p className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    ₹{last7Days.toFixed(2)}
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total spent this week
                </p>
            </div>
        </div>
    );
};

export default Home;
