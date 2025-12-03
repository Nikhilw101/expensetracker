import React from 'react';

const StabilityScoreGauge = ({ score, darkMode }) => {
    const getColor = () => {
        if (score >= 80) return '#10b981'; // green
        if (score >= 60) return '#f59e0b'; // yellow
        return '#ef4444'; // red
    };

    const getLabel = () => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Improvement';
    };

    const circumference = 2 * Math.PI * 70; // radius = 70
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-48 h-48">
                {/* Background circle */}
                <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                        cx="96"
                        cy="96"
                        r="70"
                        stroke={darkMode ? '#374151' : '#e5e7eb'}
                        strokeWidth="12"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="70"
                        stroke={getColor()}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Score text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {score}
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        out of 100
                    </span>
                </div>
            </div>
            <div className="mt-4 text-center">
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {getLabel()}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Financial Stability
                </p>
            </div>
        </div>
    );
};

export default StabilityScoreGauge;
