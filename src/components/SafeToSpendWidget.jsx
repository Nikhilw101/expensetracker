import React from 'react';

const SafeToSpendWidget = ({ amount, status, darkMode }) => {
    const getStatusColor = () => {
        if (status === 'good') return darkMode ? 'from-green-600 to-emerald-600' : 'from-green-500 to-emerald-500';
        if (status === 'warning') return darkMode ? 'from-yellow-600 to-orange-600' : 'from-yellow-500 to-orange-500';
        return darkMode ? 'from-red-600 to-pink-600' : 'from-red-500 to-pink-500';
    };

    const getStatusText = () => {
        if (amount <= 0) return 'Budget exceeded';
        if (status === 'good') return 'On track';
        if (status === 'warning') return 'Watch spending';
        return 'Over budget';
    };

    const getRecommendation = () => {
        if (amount <= 0) return 'Consider reducing expenses';
        if (status === 'good') return 'You\'re doing well!';
        if (status === 'warning') return 'Be mindful of purchases';
        return 'Cut back on non-essentials';
    };

    return (
        <div className={`bg-gradient-to-br ${getStatusColor()} rounded-3xl p-6 shadow-xl mb-6`}>
            <p className="text-white text-sm opacity-90 mb-1">Daily Budget Remaining</p>
            <h2 className="text-white text-5xl font-bold mb-2">₹{Math.abs(amount).toFixed(0)}</h2>
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${status === 'good' ? 'bg-green-200' :
                    status === 'warning' ? 'bg-yellow-200' : 'bg-red-200'
                    } animate-pulse`}></div>
                <p className="text-white text-sm font-semibold">{getStatusText()}</p>
            </div>
            <p className="text-white text-xs opacity-75">{getRecommendation()}</p>
        </div>
    );
};

export default SafeToSpendWidget;
