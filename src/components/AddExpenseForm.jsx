import React from 'react';

const AddExpenseForm = ({ formData, setFormData, onSubmit, onCancel, isEditing, darkMode }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {isEditing ? 'Edit Expense' : 'Add Expense'}
            </h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={`w-full p-4 rounded-2xl mb-3 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                    step="0.01"
                    min="0.01"
                    required
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full p-4 rounded-2xl mb-3 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                />
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                    required
                />
                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-2xl font-semibold active:scale-95 transition-transform"
                    >
                        {isEditing ? 'Update' : 'Add'} Expense
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`flex-1 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} py-4 rounded-2xl font-semibold active:scale-95 transition-transform`}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddExpenseForm;
