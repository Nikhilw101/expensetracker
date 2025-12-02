import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const Limit = () => {
    const { spendingLimit, updateSpendingLimit, darkMode } = useApp();
    const [newLimit, setNewLimit] = useState(spendingLimit.toString());
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = updateSpendingLimit(newLimit);
        if (success) {
            setIsEditing(false);
        }
    };

    return (
        <div className="pb-20 px-4 pt-6">
            <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Spending Limit
            </h1>

            <div className={`${darkMode ? 'bg-gradient-to-br from-orange-600 to-red-600' : 'bg-gradient-to-br from-orange-500 to-red-500'} rounded-3xl p-6 mb-6 shadow-xl`}>
                <p className="text-white text-sm opacity-90 mb-1">Daily Limit</p>
                <h2 className="text-white text-5xl font-bold mb-4">₹{spendingLimit.toFixed(2)}</h2>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold active:scale-95 transition-transform"
                >
                    Edit Limit
                </button>
            </div>

            {isEditing && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Set New Limit
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="number"
                            placeholder="New daily limit (₹)"
                            value={newLimit}
                            onChange={(e) => setNewLimit(e.target.value)}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                            step="0.01"
                            min="0.01"
                            required
                        />
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-semibold active:scale-95 transition-transform"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className={`flex-1 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} py-4 rounded-2xl font-semibold active:scale-95 transition-transform`}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    About Spending Limit
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Set a daily spending limit to help manage your expenses. You'll get visual alerts when you're approaching or exceeding your limit.
                </p>
            </div>
        </div>
    );
};

export default Limit;
