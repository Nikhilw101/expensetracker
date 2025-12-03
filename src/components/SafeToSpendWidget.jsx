import React from 'react';

const SafeToSpendWidget = ({ amount, status, darkMode }) => {
    const getStatusColor = () => {
        if (status === 'good') return darkMode ? 'from-green-600 to-green-500' : 'from-green-500 to-green-400';
        if (status === 'warning') return darkMode ? 'from-yellow-600 to-yellow-500' : 'from-yellow-500 to-yellow-400';
        return darkMode ? 'from-red-600 to-red-500' : 'from-red-500 to-red-400';
    };

    const getStatusText = () => {
        if (status === 'good') return 'Safe to spend';
        if (status === 'warning') return 'Be careful';
        return 'Over budget';
    };

    return (
        <div className={`bg-gradient-to-br ${getStatusColor()} rounded-3xl p-6 shadow-xl mb-6`}>
            <p className="text-white text-sm opacity-90 mb-1">Safe to Spend Today</p>
            <h2 className="text-white text-5xl font-bold mb-2">₹{amount.toFixed(0)}</h2>
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${status === 'good' ? 'bg-green-200' :
                        status === 'warning' ? 'bg-yellow-200' : 'bg-red-200'
                    } animate-pulse`}></div>
                <p className="text-white text-sm font-semibold">{getStatusText()}</p>
            </div>
        </div>
    );
};

export default SafeToSpendWidget;
