import React from 'react';

const AddIncomeForm = ({ amount, setAmount, onSubmit, onCancel, darkMode }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Add Income
            </h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                    step="0.01"
                    min="0.01"
                    required
                />
                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold active:scale-95 transition-transform"
                    >
                        Add Income
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

export default AddIncomeForm;
