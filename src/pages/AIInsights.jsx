import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import AIInsightCard from '../components/AIInsightCard';
import SafeToSpendWidget from '../components/SafeToSpendWidget';
import StabilityScoreGauge from '../components/StabilityScoreGauge';
import AIChatInterface from '../components/AIChatInterface';
import {
    Brain,
    TrendingUp,
    Calendar,
    AlertTriangle,
    Target,
    User,
    Sparkles
} from 'lucide-react';
import {
    generateFinancialSummary,
    detectOverspendingPatterns,
    predictFutureExpenses,
    calculateSafeToSpend,
    detectAnomalies,
    generateStabilityScore,
    analyzeBehaviorProfile,
    chatWithAI
} from '../services/geminiService';

const AIInsights = () => {
    const { expenses, income, spendingLimit, darkMode } = useApp();

    const [insights, setInsights] = useState({
        summary: { loading: false, content: '', error: null },
        patterns: { loading: false, content: '', error: null },
        prediction: { loading: false, content: '', error: null },
        safeToSpend: { loading: false, amount: 0, status: 'good', error: null },
        anomalies: { loading: false, content: '', error: null },
        stability: { loading: false, score: 0, explanation: '', error: null },
        behavior: { loading: false, content: '', error: null }
    });

    // Load cached insights from localStorage
    useEffect(() => {
        const cached = localStorage.getItem('aiInsights');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                const now = Date.now();
                // Cache valid for 1 hour
                if (now - parsed.timestamp < 3600000) {
                    setInsights(prev => ({ ...prev, ...parsed.data }));
                }
            } catch (e) {
                console.error('Error loading cached insights:', e);
            }
        }
    }, []);

    // Save insights to localStorage
    const saveToCache = (newInsights) => {
        try {
            localStorage.setItem('aiInsights', JSON.stringify({
                timestamp: Date.now(),
                data: newInsights
            }));
        } catch (e) {
            console.error('Error caching insights:', e);
        }
    };

    // Generate all insights
    const generateAllInsights = async () => {
        if (expenses.length === 0) {
            return;
        }

        // Financial Summary
        setInsights(prev => ({ ...prev, summary: { loading: true, content: '', error: null } }));
        try {
            const summary = await generateFinancialSummary(expenses, income);
            setInsights(prev => {
                const updated = { ...prev, summary: { loading: false, content: summary, error: null } };
                saveToCache(updated);
                return updated;
            });
        } catch (error) {
            setInsights(prev => ({ ...prev, summary: { loading: false, content: '', error: 'Failed to generate summary' } }));
        }

        // Overspending Patterns
        setInsights(prev => ({ ...prev, patterns: { loading: true, content: '', error: null } }));
        try {
            const patterns = await detectOverspendingPatterns(expenses);
            setInsights(prev => {
                const updated = { ...prev, patterns: { loading: false, content: patterns, error: null } };
                saveToCache(updated);
                return updated;
            });
        } catch (error) {
            setInsights(prev => ({ ...prev, patterns: { loading: false, content: '', error: 'Failed to detect patterns' } }));
        }

        // Future Prediction
        setInsights(prev => ({ ...prev, prediction: { loading: true, content: '', error: null } }));
        try {
            const prediction = await predictFutureExpenses(expenses, 7);
            setInsights(prev => {
                const updated = { ...prev, prediction: { loading: false, content: prediction, error: null } };
                saveToCache(updated);
                return updated;
            });
        } catch (error) {
            setInsights(prev => ({ ...prev, prediction: { loading: false, content: '', error: 'Failed to predict expenses' } }));
        }

        // Anomalies
        setInsights(prev => ({ ...prev, anomalies: { loading: true, content: '', error: null } }));
        try {
            const anomalies = await detectAnomalies(expenses);
            setInsights(prev => {
                const updated = { ...prev, anomalies: { loading: false, content: anomalies, error: null } };
                saveToCache(updated);
                return updated;
            });
        } catch (error) {
            setInsights(prev => ({ ...prev, anomalies: { loading: false, content: '', error: 'Failed to detect anomalies' } }));
        }

        // Stability Score
        setInsights(prev => ({ ...prev, stability: { loading: true, score: 0, explanation: '', error: null } }));
        try {
            const stability = await generateStabilityScore(expenses);
            setInsights(prev => {
                const updated = { ...prev, stability: { loading: false, ...stability, error: null } };
                saveToCache(updated);
                return updated;
            });
        } catch (error) {
            setInsights(prev => ({ ...prev, stability: { loading: false, score: 0, explanation: '', error: 'Failed to calculate score' } }));
        }

        // Behavior Profile
        setInsights(prev => ({ ...prev, behavior: { loading: true, content: '', error: null } }));
        try {
            const behavior = await analyzeBehaviorProfile(expenses);
            setInsights(prev => {
                const updated = { ...prev, behavior: { loading: false, content: behavior, error: null } };
                saveToCache(updated);
                return updated;
            });
        } catch (error) {
            setInsights(prev => ({ ...prev, behavior: { loading: false, content: '', error: 'Failed to analyze behavior' } }));
        }
    };

    // Calculate safe to spend
    const calculateSafe = async () => {
        setInsights(prev => ({ ...prev, safeToSpend: { loading: true, amount: 0, status: 'good', error: null } }));
        try {
            const today = new Date();
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            const dayOfMonth = today.getDate();
            const daysRemaining = daysInMonth - dayOfMonth + 1;

            const monthExpenses = expenses.filter(e => {
                const expDate = new Date(e.date);
                return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
            });

            const spentThisMonth = monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
            const monthlyBudget = income.amount;
            const remaining = monthlyBudget - spentThisMonth;
            const safeDaily = Math.max(0, remaining / daysRemaining);

            // Calculate expected spending rate
            const daysPassed = dayOfMonth;
            const expectedSpent = (monthlyBudget / daysInMonth) * daysPassed;
            const difference = spentThisMonth - expectedSpent;

            let status = 'good';
            if (remaining < 0) {
                status = 'danger'; // Over budget
            } else if (difference > monthlyBudget * 0.1) {
                status = 'warning'; // Spending more than 10% over expected rate
            } else if (safeDaily < spendingLimit * 0.5) {
                status = 'warning'; // Daily budget getting tight
            }

            setInsights(prev => {
                const updated = { ...prev, safeToSpend: { loading: false, amount: safeDaily, status, error: null } };
                saveToCache(updated);
                return updated;
            });
        } catch (error) {
            setInsights(prev => ({ ...prev, safeToSpend: { loading: false, amount: 0, status: 'good', error: 'Failed to calculate' } }));
        }
    };

    // Load insights on mount
    useEffect(() => {
        if (expenses.length > 0) {
            generateAllInsights();
            calculateSafe();
        }
    }, []);

    // Handle chat messages
    const handleChatMessage = async (message) => {
        const response = await chatWithAI(message, expenses, income);
        return response;
    };

    return (
        <div className="pb-20 px-4 pt-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-2xl">
                    <Sparkles size={28} className="text-white" />
                </div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    AI Insights
                </h1>
            </div>

            {expenses.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 text-center`}>
                    <Brain size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Add some expenses to get AI-powered financial insights!
                    </p>
                </div>
            ) : (
                <>
                    {/* Safe to Spend Widget */}
                    <SafeToSpendWidget
                        amount={insights.safeToSpend.amount}
                        status={insights.safeToSpend.status}
                        darkMode={darkMode}
                    />

                    {/* Financial Summary */}
                    <AIInsightCard
                        title="Financial Summary"
                        icon={Brain}
                        content={insights.summary.content}
                        loading={insights.summary.loading}
                        error={insights.summary.error}
                        onRefresh={generateAllInsights}
                        darkMode={darkMode}
                        gradient="from-purple-500 to-blue-500"
                    />

                    {/* Overspending Patterns */}
                    <AIInsightCard
                        title="Spending Patterns"
                        icon={TrendingUp}
                        content={insights.patterns.content}
                        loading={insights.patterns.loading}
                        error={insights.patterns.error}
                        darkMode={darkMode}
                        gradient="from-orange-500 to-red-500"
                    />

                    {/* Future Prediction */}
                    <AIInsightCard
                        title="7-Day Forecast"
                        icon={Calendar}
                        content={insights.prediction.content}
                        loading={insights.prediction.loading}
                        error={insights.prediction.error}
                        darkMode={darkMode}
                        gradient="from-blue-500 to-cyan-500"
                    />

                    {/* Stability Score */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-lg mb-4`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl">
                                <Target size={24} className="text-white" />
                            </div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Stability Score
                            </h3>
                        </div>
                        {insights.stability.loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                            </div>
                        ) : insights.stability.error ? (
                            <p className="text-red-500 text-center">{insights.stability.error}</p>
                        ) : (
                            <>
                                <StabilityScoreGauge score={insights.stability.score} darkMode={darkMode} />
                                {insights.stability.explanation && (
                                    <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                                        {insights.stability.explanation}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Anomaly Detection */}
                    <AIInsightCard
                        title="Unusual Transactions"
                        icon={AlertTriangle}
                        content={insights.anomalies.content}
                        loading={insights.anomalies.loading}
                        error={insights.anomalies.error}
                        darkMode={darkMode}
                        gradient="from-yellow-500 to-orange-500"
                    />

                    {/* Behavior Profile */}
                    <AIInsightCard
                        title="Spending Personality"
                        icon={User}
                        content={insights.behavior.content}
                        loading={insights.behavior.loading}
                        error={insights.behavior.error}
                        darkMode={darkMode}
                        gradient="from-pink-500 to-purple-500"
                    />

                    {/* AI Chat Assistant */}
                    <AIChatInterface
                        onSendMessage={handleChatMessage}
                        darkMode={darkMode}
                    />
                </>
            )}
        </div>
    );
};

export default AIInsights;
