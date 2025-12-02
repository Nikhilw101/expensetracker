import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../contexts/AppContext';

const Summary = () => {
    const { summaryHistory, expenses, income, darkMode } = useApp();

    const currentSummary = {
        totalIncome: income.amount,
        totalExpenses: expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
        balance: income.amount - expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
        categoryData: Object.entries(
            expenses.reduce((acc, e) => {
                acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount || 0);
                return acc;
            }, {})
        ).map(([name, value]) => ({ name, value }))
    };

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

    return (
        <div className="pb-20 px-4 pt-6">
            <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Summary
            </h1>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Current Period
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Income</span>
                        <span className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                            ₹{currentSummary.totalIncome.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Expenses</span>
                        <span className={`font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                            ₹{currentSummary.totalExpenses.toFixed(2)}
                        </span>
                    </div>
                    <div className={`flex justify-between pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Balance</span>
                        <span className={`font-bold text-xl ${currentSummary.balance >= 0
                                ? (darkMode ? 'text-green-400' : 'text-green-600')
                                : (darkMode ? 'text-red-400' : 'text-red-600')
                            }`}>
                            ₹{currentSummary.balance.toFixed(2)}
                        </span>
                    </div>
                </div>

                {currentSummary.categoryData.length > 0 && (
                    <div className="mt-6">
                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Category Breakdown
                        </h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={currentSummary.categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {currentSummary.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: darkMode ? '#1f2937' : '#fff',
                                        border: 'none',
                                        borderRadius: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {summaryHistory.length > 0 && (
                <>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Past Periods
                    </h3>
                    <div className="space-y-4">
                        {summaryHistory.slice().reverse().map((summary, idx) => (
                            <div key={idx} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                                    {new Date(summary.date).toLocaleDateString()}
                                </p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Income</p>
                                        <p className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                            ₹{summary.totalIncome.toFixed(0)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expenses</p>
                                        <p className={`font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                                            ₹{summary.totalExpenses.toFixed(0)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Balance</p>
                                        <p className={`font-bold ${summary.balance >= 0
                                                ? (darkMode ? 'text-green-400' : 'text-green-600')
                                                : (darkMode ? 'text-red-400' : 'text-red-600')
                                            }`}>
                                            ₹{summary.balance.toFixed(0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Summary;
