import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const PullToRefresh = ({ onRefresh, darkMode, children }) => {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isPulling, setIsPulling] = useState(false);
    const startY = useRef(0);
    const scrollRef = useRef(null);
    const threshold = 80;

    const handleTouchStart = (e) => {
        const scrollTop = scrollRef.current?.scrollTop || 0;
        // Only allow pull-to-refresh when scrolled to top
        if (scrollTop === 0) {
            startY.current = e.touches[0].clientY;
            setIsPulling(true);
        }
    };

    const handleTouchMove = (e) => {
        if (!isPulling || isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        // Only allow downward pull
        if (diff > 0) {
            // Add resistance effect
            const distance = Math.min(diff * 0.5, threshold * 1.5);
            setPullDistance(distance);
        }
    };

    const handleTouchEnd = async () => {
        setIsPulling(false);

        if (pullDistance > threshold) {
            setIsRefreshing(true);
            try {
                await onRefresh();
            } catch (error) {
                console.error('Refresh error:', error);
            }
            setTimeout(() => {
                setIsRefreshing(false);
                setPullDistance(0);
            }, 500);
        } else {
            setPullDistance(0);
        }
    };

    const rotation = Math.min((pullDistance / threshold) * 360, 360);
    const opacity = Math.min(pullDistance / threshold, 1);

    return (
        <div
            ref={scrollRef}
            className="relative overflow-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull indicator */}
            <div
                className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-10"
                style={{
                    transform: `translateY(${pullDistance - 60}px)`,
                    opacity: opacity,
                    transition: isPulling ? 'none' : 'all 0.3s ease-out'
                }}
            >
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-full p-3 shadow-lg`}>
                    <RefreshCw
                        size={24}
                        className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} ${isRefreshing ? 'animate-spin' : ''}`}
                        style={{
                            transform: isRefreshing ? 'none' : `rotate(${rotation}deg)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    />
                </div>
            </div>

            {/* Content with pull offset */}
            <div
                style={{
                    transform: `translateY(${pullDistance}px)`,
                    transition: isPulling ? 'none' : 'transform 0.3s ease-out'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default PullToRefresh;
