import React from 'react';
import { Sun, Moon, Download, Upload, RotateCcw, Target } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Settings = ({ setCurrentPage }) => {
    const { darkMode, setDarkMode, income, expenses, spendingLimit, summaryHistory, showToast } = useApp();

    const exportData = () => {
        const data = {
            income,
            expenses,
            spendingLimit,
            summaryHistory,
            exportDate: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `money-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Data exported successfully!');
    };

    const importData = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                window.localStorage.setItem('userIncome', JSON.stringify(data.income));
                window.localStorage.setItem('dailyExpenses', JSON.stringify(data.expenses));
                window.localStorage.setItem('spendingLimit', JSON.stringify(data.spendingLimit));
                window.localStorage.setItem('summaryHistory', JSON.stringify(data.summaryHistory));
                showToast('Data imported! Refreshing page...');
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                showToast('Error importing data', 'error');
            }
        };
        reader.readAsText(file);
    };

    const resetData = () => {
        if (window.confirm('Are you sure? This will delete all your data!')) {
            window.localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="pb-20 px-4 pt-6">
            <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Settings
            </h1>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 mb-4 shadow-md flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                    {darkMode ? <Moon className={darkMode ? 'text-purple-400' : 'text-purple-600'} /> : <Sun className="text-yellow-500" />}
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {darkMode ? 'Dark' : 'Light'} Mode
                    </span>
                </div>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-purple-600' : 'bg-gray-300'} relative`}
                >
                    <div className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
            </div>

            <button
                onClick={() => setCurrentPage('limit')}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 mb-4 shadow-md w-full flex items-center justify-between active:scale-95 transition-transform`}
            >
                <div className="flex items-center gap-3">
                    <Target className={darkMode ? 'text-orange-400' : 'text-orange-600'} />
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Spending Limit
                    </span>
                </div>
            </button>

            <button
                onClick={exportData}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 mb-4 shadow-md w-full flex items-center justify-between active:scale-95 transition-transform`}
            >
                <div className="flex items-center gap-3">
                    <Download className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Export Data
                    </span>
                </div>
            </button>

            <label className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 mb-4 shadow-md w-full flex items-center justify-between cursor-pointer active:scale-95 transition-transform block`}>
                <div className="flex items-center gap-3">
                    <Upload className={darkMode ? 'text-green-400' : 'text-green-600'} />
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Import Data
                    </span>
                </div>
                <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>

            <button
                onClick={resetData}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md w-full flex items-center justify-between active:scale-95 transition-transform`}
            >
                <div className="flex items-center gap-3">
                    <RotateCcw className="text-red-500" />
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Reset All Data
                    </span>
                </div>
            </button>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mt-6 shadow-md`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    About
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Money Manager for Hostel Students v1.0
                </p>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    All data is stored locally on your device.
                </p>
            </div>
        </div>
    );
};

export default Settings;
