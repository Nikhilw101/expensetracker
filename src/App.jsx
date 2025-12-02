import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Toast from './components/Toast';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Limit from './pages/Limit';
import Analytics from './pages/Analytics';
import Summary from './pages/Summary';
import Settings from './pages/Settings';

const AppContent = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const { darkMode, toastState } = useApp();

    const pages = {
        home: Home,
        expenses: Expenses,
        income: Income,
        limit: Limit,
        analytics: Analytics,
        summary: Summary,
        settings: Settings
    };

    const CurrentPage = pages[currentPage];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Toast show={toastState.show} message={toastState.message} type={toastState.type} />
            <CurrentPage />
            <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} darkMode={darkMode} />
        </div>
    );
};

const App = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
