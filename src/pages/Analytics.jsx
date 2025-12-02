import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../contexts/AppContext';

const Analytics = () => {
    const { expenses, income, darkMode } = useApp();

    const categoryData = Object.entries(
        expenses.reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount || 0);
            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value }));

    const last7DaysData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayExpenses = expenses
            .filter(e => new Date(e.date).toDateString() === date.toDateString())
            .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            amount: dayExpenses
        };
    });

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    return (
        <div className="pb-20 px-4 pt-6">
            <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Analytics
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Income</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        ₹{income.amount.toFixed(0)}
                    </p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Expenses</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                        ₹{totalExpenses.toFixed(0)}
                    </p>
                </div>
            </div>

            {categoryData.length > 0 && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Spending by Category
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
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

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Last 7 Days
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={last7DaysData}>
                        <XAxis dataKey="day" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                        <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: darkMode ? '#1f2937' : '#fff',
                                border: 'none',
                                borderRadius: '12px'
                            }}
                        />
                        <Bar dataKey="amount" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
