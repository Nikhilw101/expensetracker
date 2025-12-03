import React from 'react';
import { RefreshCw } from 'lucide-react';

const AIInsightCard = ({
    title,
    icon: Icon,
    content,
    loading,
    error,
    onRefresh,
    darkMode,
    gradient = 'from-purple-500 to-blue-500'
}) => {
    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-lg mb-4`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className={`bg-gradient-to-r ${gradient} p-3 rounded-2xl`}>
                            <Icon size={24} className="text-white" />
                        </div>
                    )}
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {title}
                    </h3>
                </div>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className={`p-2 rounded-full active:scale-95 transition-transform ${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <RefreshCw
                            size={18}
                            className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} ${loading ? 'animate-spin' : ''
                                }`}
                        />
                    </button>
                )}
            </div>

            {loading && (
                <div className="space-y-3">
                    <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
                    <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse w-5/6`}></div>
                    <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse w-4/6`}></div>
                </div>
            )}

            {error && (
                <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-2xl p-4">
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            )}

            {!loading && !error && content && (
                <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {content}
                </div>
            )}
        </div>
    );
};

export default AIInsightCard;
