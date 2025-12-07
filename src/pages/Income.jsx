import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import IncomeCard from '../components/IncomeCard';
import AddIncomeForm from '../components/AddIncomeForm';
import ConfirmDialog from '../components/ConfirmDialog';

const Income = () => {
    const { income, addIncome, editIncomeHistoryItem, deleteIncome, darkMode } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, index: null, amount: 0 });

    const handleSubmit = () => {
        if (editingIndex !== null) {
            const success = editIncomeHistoryItem(editingIndex, amount);
            if (success) {
                setAmount('');
                setEditingIndex(null);
                setShowForm(false);
            }
        } else {
            const success = addIncome(amount);
            if (success) {
                setAmount('');
                setShowForm(false);
            }
        }
    };

    const handleEditClick = (index, currentAmount) => {
        setAmount(currentAmount.toString());
        setEditingIndex(index);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingIndex(null);
        setAmount('');
    };

    const handleDeleteClick = (index, amount) => {
        setDeleteConfirm({ show: true, index, amount });
    };

    const handleDeleteConfirm = () => {
        const success = deleteIncome(deleteConfirm.index);
        if (success) {
            setDeleteConfirm({ show: false, index: null, amount: 0 });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, index: null, amount: 0 });
    };

    return (
        <div className="pb-20 px-4 pt-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Income
                </h1>
                <button
                    onClick={() => {
                        setEditingIndex(null);
                        setAmount('');
                        setShowForm(!showForm);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>

            <IncomeCard income={income} darkMode={darkMode} />

            {showForm && (
                <div className="mb-6">
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {editingIndex !== null ? 'Edit Income' : 'Add Income'}
                    </h3>
                    <AddIncomeForm
                        amount={amount}
                        setAmount={setAmount}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        darkMode={darkMode}
                    />
                </div>
            )}

            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                History
            </h3>
            <div className="space-y-3">
                {income.history.slice().reverse().map((item, idx) => {
                    const realIndex = income.history.length - 1 - idx;
                    return (
                        <div
                            key={idx}
                            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md flex justify-between items-center`}
                        >
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {new Date(item.date).toLocaleDateString()}
                                </p>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                    +₹{item.amount.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditClick(realIndex, item.amount)}
                                    className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} active:scale-95 transition-transform`}
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(realIndex, item.amount)}
                                    className={`p-2 rounded-full ${darkMode ? 'bg-red-900 bg-opacity-30 text-red-400' : 'bg-red-100 text-red-600'} active:scale-95 transition-transform`}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
                {income.history.length === 0 && (
                    <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No income history yet
                    </p>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                show={deleteConfirm.show}
                title="Delete Income"
                message={`Are you sure you want to delete this income entry of ₹${deleteConfirm.amount.toFixed(2)}? This will update your total income amount.`}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                darkMode={darkMode}
                type="danger"
            />
        </div>
    );
};

export default Income;
