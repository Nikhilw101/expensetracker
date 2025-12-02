import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import IncomeCard from '../components/IncomeCard';
import AddIncomeForm from '../components/AddIncomeForm';

const Income = () => {
    const { income, addIncome, darkMode } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState('');

    const handleSubmit = () => {
        const success = addIncome(amount);
        if (success) {
            setAmount('');
            setShowForm(false);
        }
    };

    return (
        <div className="pb-20 px-4 pt-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Income
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>

            <IncomeCard income={income} darkMode={darkMode} />

            {showForm && (
                <AddIncomeForm
                    amount={amount}
                    setAmount={setAmount}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                    darkMode={darkMode}
                />
            )}

            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                History
            </h3>
            <div className="space-y-3">
                {income.history.slice().reverse().map((item, idx) => (
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
                    </div>
                ))}
                {income.history.length === 0 && (
                    <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No income history yet
                    </p>
                )}
            </div>
        </div>
    );
};

export default Income;
