import React from 'react';

const Toast = ({ show, message, type }) => {
    if (!show) return null;

    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in`}>
            {message}
        </div>
    );
};

export default Toast;
