import React, { useState, useEffect } from 'react';
import { Repeat, Plus, Pencil, Trash2, Calendar, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ConfirmDialog from '../components/ConfirmDialog';

const RecurringExpenses = () => {
    const { darkMode, addExpense } = useApp();
    const [recurringExpenses, setRecurringExpenses] = useState(
        JSON.parse(localStorage.getItem('recurringExpenses') || '[]')
    );
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        category: 'Bills',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        remindDaysBefore: '3',
        isActive: true
    });
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, index: null, name: '' });

    // Calculate next due date based on frequency
    const calculateNextDueDate = (startDate, frequency) => {
        const start = new Date(startDate);
        const now = new Date();

        switch (frequency) {
            case 'daily':
                while (start < now) {
                    start.setDate(start.getDate() + 1);
                }
                break;
            case 'weekly':
                while (start < now) {
                    start.setDate(start.getDate() + 7);
                }
                break;
            case 'monthly':
                while (start < now) {
                    start.setMonth(start.getMonth() + 1);
                }
                break;
            case 'yearly':
                while (start < now) {
                    start.setFullYear(start.getFullYear() + 1);
                }
                break;
        }

        return start.toISOString().split('T')[0];
    };

    // Save to localStorage
    const saveRecurringExpenses = (expenses) => {
        localStorage.setItem('recurringExpenses', JSON.stringify(expenses));
        setRecurringExpenses(expenses);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nextDueDate = calculateNextDueDate(formData.startDate, formData.frequency);

        const newExpense = {
            ...formData,
            id: editingIndex !== null ? recurringExpenses[editingIndex].id : Date.now(),
            amount: parseFloat(formData.amount),
            remindDaysBefore: parseInt(formData.remindDaysBefore),
            nextDueDate
        };

        let updatedExpenses;
        if (editingIndex !== null) {
            updatedExpenses = [...recurringExpenses];
            updatedExpenses[editingIndex] = newExpense;
        } else {
            updatedExpenses = [...recurringExpenses, newExpense];
        }

        saveRecurringExpenses(updatedExpenses);
        resetForm();
    };

    const handleEdit = (index) => {
        const expense = recurringExpenses[index];
        setFormData({ ...expense });
        setEditingIndex(index);
        setShowForm(true);
    };

    const handleDelete = (index) => {
        const updatedExpenses = recurringExpenses.filter((_, i) => i !== index);
        saveRecurringExpenses(updatedExpenses);
        setDeleteConfirm({ show: false, index: null, name: '' });
    };

    const handleMarkAsPaid = (index) => {
        const expense = recurringExpenses[index];

        // Add to regular expenses
        addExpense({
            amount: expense.amount,
            category: expense.category,
            description: `${expense.name} (Recurring)`,
            date: new Date().toISOString()
        });

        // Update next due date
        const updatedExpenses = [...recurringExpenses];
        updatedExpenses[index].nextDueDate = calculateNextDueDate(
            expense.nextDueDate,
            expense.frequency
        );
        saveRecurringExpenses(updatedExpenses);
    };

    const toggleActive = (index) => {
        const updatedExpenses = [...recurringExpenses];
        updatedExpenses[index].isActive = !updatedExpenses[index].isActive;
        saveRecurringExpenses(updatedExpenses);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            amount: '',
            category: 'Bills',
            frequency: 'monthly',
            startDate: new Date().toISOString().split('T')[0],
            remindDaysBefore: '3',
            isActive: true
        });
        setEditingIndex(null);
        setShowForm(false);
    };

    const getFrequencyColor = (frequency) => {
        switch (frequency) {
            case 'daily': return 'from-red-500 to-pink-500';
            case 'weekly': return 'from-orange-500 to-yellow-500';
            case 'monthly': return 'from-blue-500 to-cyan-500';
            case 'yearly': return 'from-green-500 to-emerald-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getUrgencyColor = (daysLeft) => {
        if (daysLeft < 0) return 'text-red-600 dark:text-red-400';
        if (daysLeft <= 3) return 'text-orange-600 dark:text-orange-400';
        if (daysLeft <= 7) return 'text-yellow-600 dark:text-yellow-400';
        return darkMode ? 'text-green-400' : 'text-green-600';
    };

    // Calculate total monthly recurring cost
    const totalMonthlyRecurring = recurringExpenses
        .filter(e => e.isActive)
        .reduce((sum, e) => {
            switch (e.frequency) {
                case 'daily': return sum + (e.amount * 30);
                case 'weekly': return sum + (e.amount * 4);
                case 'monthly': return sum + e.amount;
                case 'yearly': return sum + (e.amount / 12);
                default: return sum;
            }
        }, 0);

    return (
        <div className="pb-20 px-4 pt-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl">
                        <Repeat size={28} className="text-white" />
                    </div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Recurring Expenses
                    </h1>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Monthly Total */}
            <div className={`${darkMode ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'} rounded-3xl p-6 mb-6 shadow-xl`}>
                <p className="text-white text-sm opacity-90 mb-1">Estimated Monthly Recurring</p>
                <h2 className="text-white text-5xl font-bold">₹{totalMonthlyRecurring.toFixed(2)}</h2>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {editingIndex !== null ? 'Edit Recurring Expense' : 'Add Recurring Expense'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Name (e.g., Netflix Subscription)"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Amount (₹)"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                            min="0.01"
                            step="0.01"
                            required
                        />
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                        >
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Bills">Bills</option>
                            <option value="Other">Other</option>
                        </select>
                        <select
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Remind days before (e.g., 3)"
                            value={formData.remindDaysBefore}
                            onChange={(e) => setFormData({ ...formData, remindDaysBefore: e.target.value })}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                            min="0"
                        />
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold active:scale-95 transition-transform"
                            >
                                {editingIndex !== null ? 'Update' : 'Add'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className={`flex-1 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} py-4 rounded-2xl font-semibold active:scale-95 transition-transform`}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Recurring Expenses List */}
            <div className="space-y-4">
                {recurringExpenses.length === 0 ? (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 text-center`}>
                        <Repeat size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No recurring expenses yet. Add one to track subscriptions and bills!
                        </p>
                    </div>
                ) : (
                    recurringExpenses.map((expense, index) => {
                        const daysLeft = getDaysUntilDue(expense.nextDueDate);

                        return (
                            <div
                                key={expense.id}
                                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-lg ${!expense.isActive ? 'opacity-50' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                            {expense.name}
                                        </h3>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {expense.category}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleActive(index)}
                                            className={`p-2 rounded-full ${expense.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'} active:scale-95 transition-transform`}
                                            title={expense.isActive ? 'Active' : 'Inactive'}
                                        >
                                            {expense.isActive ? <CheckCircle size={18} /> : <Calendar size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} active:scale-95 transition-transform`}
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm({ show: true, index, name: expense.name })}
                                            className={`p-2 rounded-full ${darkMode ? 'bg-red-900 bg-opacity-30 text-red-400' : 'bg-red-100 text-red-600'} active:scale-95 transition-transform`}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Amount</p>
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                            ₹{expense.amount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Frequency</p>
                                        <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${getFrequencyColor(expense.frequency)} text-white text-sm font-semibold capitalize`}>
                                            {expense.frequency}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Next Due Date</p>
                                        <p className={`font-bold ${getUrgencyColor(daysLeft)}`}>
                                            {new Date(expense.nextDueDate).toLocaleDateString()}
                                            <span className="ml-2 text-sm">
                                                ({daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
                                                    daysLeft === 0 ? 'Due today' : `in ${daysLeft} days`})
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {expense.isActive && daysLeft <= 7 && (
                                    <button
                                        onClick={() => handleMarkAsPaid(index)}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-2xl font-semibold active:scale-95 transition-transform flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={20} />
                                        Mark as Paid
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                show={deleteConfirm.show}
                title="Delete Recurring Expense"
                message={`Are you sure you want to delete "${deleteConfirm.name}"? This will not affect past expenses.`}
                onConfirm={() => handleDelete(deleteConfirm.index)}
                onCancel={() => setDeleteConfirm({ show: false, index: null, name: '' })}
                darkMode={darkMode}
                type="danger"
            />
        </div>
    );
};

export default RecurringExpenses;
