import React from 'react';

const LimitProgressCircle = ({ currentSpending, limit, darkMode }) => {
    const limitPercentage = Math.min((currentSpending / limit) * 100, 100);
    const limitColor = limitPercentage > 80 ? '#ef4444' : limitPercentage > 50 ? '#f59e0b' : '#10b981';

    return (
        <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke={darkMode ? '#374151' : '#e5e7eb'}
                        strokeWidth="12"
                        fill="none"
                    />
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke={limitColor}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - limitPercentage / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        ₹{currentSpending.toFixed(0)}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        of ₹{limit}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LimitProgressCircle;
