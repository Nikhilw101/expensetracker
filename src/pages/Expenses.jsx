import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ExpenseItem from '../components/ExpenseItem';
import AddExpenseForm from '../components/AddExpenseForm';

const Expenses = () => {
    const { expenses, addExpense, updateExpense, deleteExpense, darkMode } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [filter, setFilter] = useState('all');

    const categories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Other'];

    const handleSubmit = () => {
        let success = false;
        if (editingExpense) {
            success = updateExpense(editingExpense.id, formData);
        } else {
            success = addExpense(formData);
        }

        if (success) {
            setFormData({
                amount: '',
                category: 'Food',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            setShowForm(false);
            setEditingExpense(null);
        }
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({
            amount: expense.amount.toString(),
            category: expense.category,
            description: expense.description || '',
            date: new Date(expense.date).toISOString().split('T')[0]
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingExpense(null);
        setFormData({
            amount: '',
            category: 'Food',
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const filteredExpenses = expenses
        .filter(e => filter === 'all' || e.category === filter)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="pb-20 px-4 pt-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Expenses
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>

            {showForm && (
                <AddExpenseForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isEditing={!!editingExpense}
                    darkMode={darkMode}
                />
            )}

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full whitespace-nowrap active:scale-95 transition-transform ${filter === 'all'
                            ? 'bg-purple-500 text-white'
                            : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100'
                        }`}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap active:scale-95 transition-transform ${filter === cat
                                ? 'bg-purple-500 text-white'
                                : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredExpenses.map(expense => (
                    <ExpenseItem
                        key={expense.id}
                        expense={expense}
                        onEdit={handleEdit}
                        onDelete={deleteExpense}
                        darkMode={darkMode}
                    />
                ))}
                {filteredExpenses.length === 0 && (
                    <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No expenses yet
                    </p>
                )}
            </div>
        </div>
    );
};

export default Expenses;
