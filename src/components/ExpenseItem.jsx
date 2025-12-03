import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const ExpenseItem = ({ expense, onEdit, onDelete, darkMode }) => {
    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md flex justify-between items-center`}>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(expense.date).toLocaleDateString()}
                    </span>
                </div>
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {expense.description || 'No description'}
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    ₹{parseFloat(expense.amount).toFixed(2)}
                </p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(expense)}
                    className={`p-2 rounded-full active:scale-95 transition-transform ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                    <Edit2 size={18} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                </button>
                <button
                    onClick={() => onDelete(expense.id)}
                    className={`p-2 rounded-full active:scale-95 transition-transform ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                    <Trash2 size={18} className="text-red-500" />
                </button>
            </div>
        </div>
    );
};

export default ExpenseItem;
