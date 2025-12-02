import React from 'react';

const IncomeCard = ({ income, darkMode }) => {
    return (
        <div className={`${darkMode ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-green-500 to-emerald-500'} rounded-3xl p-6 mb-6 shadow-xl`}>
            <p className="text-white text-sm opacity-90 mb-1">Total Income</p>
            <h2 className="text-white text-5xl font-bold mb-2">₹{income.amount.toFixed(2)}</h2>
            <p className="text-white text-sm opacity-75">
                Since {new Date(income.startDate).toLocaleDateString()}
            </p>
        </div>
    );
};

export default IncomeCard;
