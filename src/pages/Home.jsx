import React from 'react';
import { useApp } from '../contexts/AppContext';
import LimitProgressCircle from '../components/LimitProgressCircle';
import { Target, Repeat, Sparkles, ArrowRight } from 'lucide-react';

const Home = ({ setCurrentPage }) => {
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

    // Load savings goals and recurring expenses
    const savingsGoals = JSON.parse(localStorage.getItem('savingsGoals') || '[]');
    const recurringExpenses = JSON.parse(localStorage.getItem('recurringExpenses') || '[]');

    const activeGoals = savingsGoals.filter(g => (g.currentAmount / g.targetAmount) < 1).length;
    const activeRecurring = recurringExpenses.filter(r => r.isActive).length;

    const quickAccessCards = [
        {
            id: 'savingsgoals',
            title: 'Savings Goals',
            icon: Target,
            gradient: 'from-green-500 to-emerald-500',
            stat: activeGoals > 0 ? `${activeGoals} Active` : 'Get Started',
            description: 'Track your financial goals'
        },
        {
            id: 'recurring',
            title: 'Recurring Bills',
            icon: Repeat,
            gradient: 'from-purple-500 to-pink-500',
            stat: activeRecurring > 0 ? `${activeRecurring} Active` : 'Add Bills',
            description: 'Manage subscriptions & bills'
        },
        {
            id: 'aiinsights',
            title: 'AI Insights',
            icon: Sparkles,
            gradient: 'from-blue-500 to-cyan-500',
            stat: 'Powered by AI',
            description: 'Smart financial analysis'
        }
    ];

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

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
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

            {/* Quick Access Cards */}
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Quick Access
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {quickAccessCards.map(card => (
                    <button
                        key={card.id}
                        onClick={() => setCurrentPage(card.id)}
                        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-5 shadow-lg active:scale-95 transition-transform`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`bg-gradient-to-r ${card.gradient} p-4 rounded-2xl`}>
                                    <card.icon size={28} className="text-white" />
                                </div>
                                <div className="text-left">
                                    <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {card.title}
                                    </h4>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {card.description}
                                    </p>
                                    <p className={`text-sm font-semibold mt-1 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                                        {card.stat}
                                    </p>
                                </div>
                            </div>
                            <ArrowRight size={24} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;
