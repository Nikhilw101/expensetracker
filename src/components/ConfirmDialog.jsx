import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ show, title, message, onConfirm, onCancel, darkMode, type = 'danger' }) => {
    if (!show) return null;

    const typeColors = {
        danger: 'from-red-500 to-pink-500',
        warning: 'from-yellow-500 to-orange-500',
        info: 'from-blue-500 to-cyan-500'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl max-w-md w-full transform transition-all animate-scale-in`}>
                {/* Header */}
                <div className={`bg-gradient-to-r ${typeColors[type]} p-6 rounded-t-3xl`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white bg-opacity-20 p-2 rounded-full">
                                <AlertTriangle size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                        </div>
                        <button
                            onClick={onCancel}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 pt-0">
                    <button
                        onClick={onCancel}
                        className={`flex-1 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} py-3 rounded-2xl font-semibold active:scale-95 transition-transform`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 bg-gradient-to-r ${typeColors[type]} text-white py-3 rounded-2xl font-semibold active:scale-95 transition-transform shadow-lg`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
