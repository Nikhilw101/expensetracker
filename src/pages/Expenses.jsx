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
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

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
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const sortedExpenses = expenses
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



            <div className="space-y-3">
                {sortedExpenses.map(expense => (
                    <ExpenseItem
                        key={expense.id}
                        expense={expense}
                        onEdit={handleEdit}
                        onDelete={deleteExpense}
                        darkMode={darkMode}
                    />
                ))}
                {sortedExpenses.length === 0 && (
                    <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No expenses yet
                    </p>
                )}
            </div>
        </div>
    );
};

export default Expenses;
