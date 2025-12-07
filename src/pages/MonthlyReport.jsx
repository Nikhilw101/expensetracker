import React, { useState } from 'react';
import { FileText, Calendar, TrendingDown, TrendingUp, Download } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { generateMonthlyReport } from '../services/geminiService';

const MonthlyReport = () => {
    const { expenses, income, darkMode } = useApp();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [report, setReport] = useState({ loading: false, content: '', error: null });

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleGenerateReport = async () => {
        setReport({ loading: true, content: '', error: null });
        try {
            const content = await generateMonthlyReport(expenses, income, selectedMonth, selectedYear);
            setReport({ loading: false, content, error: null });
        } catch (error) {
            setReport({ loading: false, content: '', error: 'Failed to generate report' });
        }
    };

    // Calculate monthly stats
    const monthExpenses = expenses.filter(e => {
        const expDate = new Date(e.date);
        return expDate.getMonth() === selectedMonth && expDate.getFullYear() === selectedYear;
    });

    const totalMonthExpenses = monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const savingsAmount = income.amount - totalMonthExpenses;
    const savingsRate = income.amount > 0 ? ((savingsAmount / income.amount) * 100).toFixed(1) : 0;

    // Category breakdown
    const categoryTotals = {};
    monthExpenses.forEach(e => {
        const cat = e.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(e.amount);
    });

    const topCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <div className="pb-20 px-4 pt-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-2xl">
                    <FileText size={28} className="text-white" />
                </div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Monthly Report
                </h1>
            </div>

            {/* Month/Year Selector */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Select Month
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                    >
                        {months.map((month, idx) => (
                            <option key={idx} value={idx}>{month}</option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                    >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleGenerateReport}
                    disabled={report.loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-semibold active:scale-95 transition-transform disabled:opacity-50"
                >
                    {report.loading ? 'Generating...' : 'Generate AI Report'}
                </button>
            </div>

            {/* Monthly Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`${darkMode ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-green-500 to-emerald-500'} rounded-3xl p-5 shadow-lg`}>
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={20} className="text-white opacity-75" />
                        <p className="text-white text-sm opacity-90">Income</p>
                    </div>
                    <p className="text-white text-3xl font-bold">₹{income.amount.toFixed(2)}</p>
                </div>

                <div className={`${darkMode ? 'bg-gradient-to-br from-red-600 to-pink-600' : 'bg-gradient-to-br from-red-500 to-pink-500'} rounded-3xl p-5 shadow-lg`}>
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown size={20} className="text-white opacity-75" />
                        <p className="text-white text-sm opacity-90">Expenses</p>
                    </div>
                    <p className="text-white text-3xl font-bold">₹{totalMonthExpenses.toFixed(2)}</p>
                </div>
            </div>

            <div className={`${darkMode ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'} rounded-3xl p-6 mb-6 shadow-xl`}>
                <p className="text-white text-sm opacity-90 mb-1">Net Savings</p>
                <h2 className="text-white text-5xl font-bold mb-2">₹{savingsAmount.toFixed(2)}</h2>
                <p className="text-white text-sm opacity-90">Savings Rate: {savingsRate}%</p>
            </div>

            {/* Top Categories */}
            {topCategories.length > 0 && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Top Spending Categories
                    </h3>
                    <div className="space-y-3">
                        {topCategories.map(([category, amount], index) => {
                            const percentage = ((amount / totalMonthExpenses) * 100).toFixed(1);
                            const colors = [
                                'from-red-500 to-pink-500',
                                'from-orange-500 to-yellow-500',
                                'from-blue-500 to-cyan-500'
                            ];
                            return (
                                <div key={category}>
                                    <div className="flex justify-between mb-1">
                                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                            {category}
                                        </span>
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                            ₹{amount.toFixed(2)} ({percentage}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-full bg-gradient-to-r ${colors[index]} rounded-full`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* AI Report */}
            {report.content && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-lg`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            AI Analysis
                        </h3>
                        <Calendar size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    </div>
                    <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed whitespace-pre-line`}>
                        {report.content}
                    </div>
                </div>
            )}

            {report.error && (
                <div className={`${darkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-100'} rounded-3xl p-6`}>
                    <p className="text-red-500 text-center">{report.error}</p>
                </div>
            )}

            {monthExpenses.length === 0 && !report.loading && !report.content && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 text-center`}>
                    <Calendar size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No expenses recorded for {months[selectedMonth]} {selectedYear}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MonthlyReport;
