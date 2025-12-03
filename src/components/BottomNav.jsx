import React from 'react';
import { Wallet, TrendingUp, Plus, Target, BarChart3, Settings, Sparkles } from 'lucide-react';

const BottomNav = ({ currentPage, setCurrentPage, darkMode }) => {
    const navItems = [
        { id: 'home', icon: Wallet, label: 'Home' },
        { id: 'expenses', icon: TrendingUp, label: 'Expenses' },
        { id: 'aiinsights', icon: Sparkles, label: 'AI Insights' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} overflow-x-auto z-40`}>
            <div className="flex justify-around items-center h-16 px-2 min-w-max">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id)}
                        className={`flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all active:scale-95 ${currentPage === item.id
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                            : darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="text-xs mt-1 whitespace-nowrap">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
