import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const SwipeableExpenseItem = ({ expense, onEdit, onDelete, darkMode }) => {
    const [swipeX, setSwipeX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startX = useRef(0);
    const currentX = useRef(0);

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
        setIsSwiping(true);
    };

    const handleTouchMove = (e) => {
        if (!isSwiping) return;
        currentX.current = e.touches[0].clientX;
        const diff = currentX.current - startX.current;
        // Only allow left swipe (negative values)
        if (diff < 0) {
            setSwipeX(Math.max(diff, -100));
        }
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
        // If swiped more than 50px, show actions, else reset
        if (swipeX < -50) {
            setSwipeX(-80);
        } else {
            setSwipeX(0);
        }
    };

    return (
        <div className="relative overflow-hidden">
            {/* Action buttons (revealed on swipe) */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center gap-2 pr-4">
                <button
                    onClick={() => {
                        onEdit(expense);
                        setSwipeX(0);
                    }}
                    className="bg-blue-500 text-white p-3 rounded-xl active:scale-95 transition-transform"
                >
                    <Pencil size={18} />
                </button>
                <button
                    onClick={() => {
                        onDelete(expense.id);
                        setSwipeX(0);
                    }}
                    className="bg-red-500 text-white p-3 rounded-xl active:scale-95 transition-transform"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Swipeable content */}
            <div
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-md transition-transform touch-pan-y`}
                style={{
                    transform: `translateX(${swipeX}px)`,
                    transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {expense.description || 'No description'}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            {expense.category} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right ml-4">
                        <p className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                            -₹{parseFloat(expense.amount).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwipeableExpenseItem;
