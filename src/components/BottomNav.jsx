import React, { useState } from 'react';
import { Wallet, TrendingUp, Target, BarChart3, Menu, X, Sparkles, Repeat, DollarSign, FileText, Calendar, Settings } from 'lucide-react';

const BottomNav = ({ currentPage, setCurrentPage, darkMode }) => {
    const [showMenu, setShowMenu] = useState(false);

    const mainNavItems = [
        { id: 'home', icon: Wallet, label: 'Home' },
        { id: 'expenses', icon: TrendingUp, label: 'Expenses' },
        { id: 'aiinsights', icon: Sparkles, label: 'AI' },
        { id: 'analytics', icon: BarChart3, label: 'Charts' }
    ];

    const menuItems = [
        { id: 'income', icon: DollarSign, label: 'Income', color: 'from-green-500 to-emerald-500' },
        { id: 'savingsgoals', icon: Target, label: 'Savings Goals', color: 'from-green-500 to-emerald-500' },
        { id: 'recurring', icon: Repeat, label: 'Recurring Expenses', color: 'from-purple-500 to-pink-500' },
        { id: 'limit', icon: Calendar, label: 'Spending Limit', color: 'from-orange-500 to-red-500' },
        { id: 'monthlyreport', icon: FileText, label: 'Monthly Report', color: 'from-blue-500 to-cyan-500' },
        { id: 'summary', icon: FileText, label: '30-Day Summary', color: 'from-blue-500 to-cyan-500' },
        { id: 'settings', icon: Settings, label: 'Settings', color: 'from-gray-500 to-gray-600' }
    ];

    const handleMenuItemClick = (id) => {
        setCurrentPage(id);
        setShowMenu(false);
    };

    return (
        <>
            {/* Menu Modal */}
            {showMenu && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowMenu(false)}>
                    <div
                        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl w-full max-w-lg p-6 pb-20 animate-slide-up`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                More Options
                            </h3>
                            <button
                                onClick={() => setShowMenu(false)}
                                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleMenuItemClick(item.id)}
                                    className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl p-4 flex flex-col items-center gap-3 active:scale-95 transition-transform ${currentPage === item.id ? 'ring-2 ring-purple-500' : ''}`}
                                >
                                    <div className={`bg-gradient-to-r ${item.color} p-3 rounded-2xl`}>
                                        <item.icon size={24} className="text-white" />
                                    </div>
                                    <span className={`text-sm font-semibold text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} z-40`}>
                <div className="flex justify-around items-center h-16 px-2">
                    {mainNavItems.map(item => (
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

                    {/* Menu Button */}
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all active:scale-95 ${showMenu ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                        <Menu size={20} />
                        <span className="text-xs mt-1 whitespace-nowrap">More</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default BottomNav;
