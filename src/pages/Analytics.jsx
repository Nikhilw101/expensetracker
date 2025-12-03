import React from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { TrendingUp, TrendingDown, Calendar, Clock } from 'lucide-react';

const Analytics = () => {
    const { expenses, income, darkMode } = useApp();

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const balance = income.amount - totalExpenses;

    // Last 30 days spending trend
    const last30DaysData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dayExpenses = expenses
            .filter(e => new Date(e.date).toDateString() === date.toDateString())
            .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
        return {
            day: date.getDate(),
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: dayExpenses
        };
    });

    // Last 7 days comparison
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

    // Time of day analysis
    const timeOfDayData = [
        { time: 'Morning', range: '6AM-12PM', amount: 0, count: 0 },
        { time: 'Afternoon', range: '12PM-6PM', amount: 0, count: 0 },
        { time: 'Evening', range: '6PM-10PM', amount: 0, count: 0 },
        { time: 'Night', range: '10PM-6AM', amount: 0, count: 0 }
    ];

    expenses.forEach(e => {
        const hour = new Date(e.date).getHours();
        let index;
        if (hour >= 6 && hour < 12) index = 0;
        else if (hour >= 12 && hour < 18) index = 1;
        else if (hour >= 18 && hour < 22) index = 2;
        else index = 3;

        timeOfDayData[index].amount += parseFloat(e.amount);
        timeOfDayData[index].count++;
    });

    // Calculate statistics
    const avgDailySpend = expenses.length > 0
        ? totalExpenses / Math.max(1, getDaysBetween(expenses))
        : 0;

    const highestSpendDay = expenses.length > 0
        ? expenses.reduce((max, e) => parseFloat(e.amount) > parseFloat(max.amount) ? e : max)
        : null;

    const lowestSpendDay = expenses.length > 0
        ? expenses.reduce((min, e) => parseFloat(e.amount) < parseFloat(min.amount) ? e : min)
        : null;

    // Spending velocity (cumulative)
    const velocityData = last30DaysData.map((day, index) => {
        const cumulative = last30DaysData
            .slice(0, index + 1)
            .reduce((sum, d) => sum + d.amount, 0);
        return {
            ...day,
            cumulative
        };
    });

    const COLORS = {
        primary: '#8b5cf6',
        secondary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
    };

    return (
        <div className="pb-20 px-4 pt-6">
            <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Analytics
            </h1>

            {/* Summary Cards */}
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
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Avg Daily</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        ₹{avgDailySpend.toFixed(0)}
                    </p>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Balance</p>
                    <p className={`text-2xl font-bold ${balance >= 0 ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
                        ₹{balance.toFixed(0)}
                    </p>
                </div>
            </div>

            {/* Highest & Lowest Spend */}
            {highestSpendDay && lowestSpendDay && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`${darkMode ? 'bg-gradient-to-br from-red-900 to-red-800' : 'bg-gradient-to-br from-red-500 to-red-600'} rounded-2xl p-4 shadow-lg`}>
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={20} className="text-white" />
                            <p className="text-white text-sm opacity-90">Highest Spend</p>
                        </div>
                        <p className="text-white text-2xl font-bold">₹{parseFloat(highestSpendDay.amount).toFixed(0)}</p>
                        <p className="text-white text-xs opacity-75 mt-1">
                            {new Date(highestSpendDay.date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className={`${darkMode ? 'bg-gradient-to-br from-green-900 to-green-800' : 'bg-gradient-to-br from-green-500 to-green-600'} rounded-2xl p-4 shadow-lg`}>
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown size={20} className="text-white" />
                            <p className="text-white text-sm opacity-90">Lowest Spend</p>
                        </div>
                        <p className="text-white text-2xl font-bold">₹{parseFloat(lowestSpendDay.amount).toFixed(0)}</p>
                        <p className="text-white text-xs opacity-75 mt-1">
                            {new Date(lowestSpendDay.date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            )}

            {/* 30-Day Spending Trend */}
            {expenses.length > 0 && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar size={20} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            30-Day Spending Trend
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={last30DaysData}>
                            <XAxis
                                dataKey="day"
                                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                            />
                            <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '14px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke={COLORS.primary}
                                strokeWidth={2}
                                dot={{ fill: COLORS.primary, r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Spending Velocity (Cumulative) */}
            {expenses.length > 0 && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Spending Velocity (30 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={velocityData}>
                            <XAxis
                                dataKey="day"
                                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                            />
                            <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                                    border: 'none',
                                    borderRadius: '12px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="cumulative"
                                stroke={COLORS.secondary}
                                fill={COLORS.secondary}
                                fillOpacity={0.3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Last 7 Days Comparison */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
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
                        <Bar dataKey="amount" fill={COLORS.primary} radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Time of Day Analysis */}
            {expenses.length > 0 && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-lg`}>
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={20} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Spending by Time of Day
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={timeOfDayData}>
                            <XAxis
                                dataKey="time"
                                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                            />
                            <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                                    border: 'none',
                                    borderRadius: '12px'
                                }}
                                formatter={(value, name, props) => [
                                    `₹${value.toFixed(2)}`,
                                    `${props.payload.count} transactions`
                                ]}
                            />
                            <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                                {timeOfDayData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {expenses.length === 0 && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 text-center`}>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No expense data yet. Start adding expenses to see analytics!
                    </p>
                </div>
            )}
        </div>
    );
};

// Helper function
function getDaysBetween(expenses) {
    if (expenses.length === 0) return 1;
    const dates = expenses.map(e => new Date(e.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    return Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1);
}

export default Analytics;
