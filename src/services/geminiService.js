/**
 * Gemini AI Service for Financial Insights
 * Provides AI-powered financial analysis using Google's Gemini API
 * ROAST MODE: Friendly, funny, brutally honest financial advisor
 */

// API Configuration - using environment variables for security
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Groq API Configuration (Fallback)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Professional AI Assistant personality prompt
const AI_PERSONALITY = `You are a professional personal finance assistant. 
Your role is to provide clear, helpful, and actionable financial advice. 
Be supportive, informative, and encouraging while maintaining professionalism.
Use minimal emojis (max 1 per response, only when appropriate).
Keep responses concise, practical, and easy to understand.
Focus on helping users make better financial decisions with empathy and expertise.`;

/**
 * Make a request to Groq API (Fallback)
 */
async function callGroqAPI(prompt) {
    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: AI_PERSONALITY
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024,
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Groq API Error:', error);
        throw error;
    }
}

/**
 * Make a request to Gemini API with Groq fallback
 */
async function callGeminiAPI(prompt) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${AI_PERSONALITY}\n\n${prompt}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            console.warn(`Gemini API failed with status ${response.status}, falling back to Groq...`);
            return await callGroqAPI(prompt);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        console.log('Attempting Groq fallback...');
        try {
            return await callGroqAPI(prompt);
        } catch (groqError) {
            console.error('Both Gemini and Groq failed:', groqError);
            throw new Error('AI service temporarily unavailable. Please try again later.');
        }
    }
}

/**
 * Generate AI Financial Summary
 */
export async function generateFinancialSummary(expenses, income, period = 'monthly') {
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const balance = income.amount - totalExpenses;
    const avgDaily = totalExpenses / (expenses.length > 0 ? Math.max(1, getDaysBetween(expenses)) : 1);

    const prompt = `Analyze this financial situation and provide helpful insights:

Income: ₹${income.amount.toFixed(2)}
Total Expenses: ₹${totalExpenses.toFixed(2)}
Current Balance: ₹${balance.toFixed(2)}
Number of Transactions: ${expenses.length}
Average Daily Spend: ₹${avgDaily.toFixed(2)}

Provide a clear 3-4 sentence summary of their financial health with actionable advice.`;

    return await callGeminiAPI(prompt);
}

/**
 * Detect Overspending Patterns
 */
export async function detectOverspendingPatterns(expenses) {
    if (expenses.length === 0) {
        return "You don't have enough transaction data yet. Start tracking your expenses to get personalized insights.";
    }

    const byDayOfWeek = groupByDayOfWeek(expenses);
    const byTimeOfDay = groupByTimeOfDay(expenses);
    const avgAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0) / expenses.length;

    const prompt = `Analyze these spending patterns and identify areas for improvement:

Average Transaction: ₹${avgAmount.toFixed(2)}

Spending by Day of Week:
${Object.entries(byDayOfWeek).map(([day, data]) =>
        `${day}: ${data.count} transactions, ₹${data.total.toFixed(2)} total, ₹${data.avg.toFixed(2)} avg`
    ).join('\n')}

Spending by Time of Day:
${Object.entries(byTimeOfDay).map(([time, data]) =>
        `${time}: ${data.count} transactions, ₹${data.total.toFixed(2)} total`
    ).join('\n')}

Identify key spending patterns and provide 3-4 actionable recommendations.`;

    return await callGeminiAPI(prompt);
}

/**
 * Predict Future Expenses
 */
export async function predictFutureExpenses(expenses, days = 7) {
    if (expenses.length === 0) {
        return `Insufficient data for predictions. Please track expenses for at least 2 weeks to get accurate forecasts.`;
    }

    const recentExpenses = expenses.slice(-14); // Last 14 days
    const totalRecent = recentExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const avgDaily = totalRecent / 14;
    const prediction = avgDaily * days;

    const trend = calculateTrend(expenses);

    const prompt = `Based on this spending pattern, provide a forecast:

Last 14 days total: ₹${totalRecent.toFixed(2)}
Average daily spend: ₹${avgDaily.toFixed(2)}
Spending trend: ${trend > 0 ? 'increasing' : 'decreasing'} by ${Math.abs(trend).toFixed(1)}% per week

Predict spending for the next ${days} days with practical insights. 2-3 sentences.`;

    return await callGeminiAPI(prompt);
}

/**
 * Calculate Safe-to-Spend Amount
 */
export async function calculateSafeToSpend(expenses, income, monthlyBudget) {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const dayOfMonth = today.getDate();
    const daysRemaining = daysInMonth - dayOfMonth + 1;

    const monthExpenses = expenses.filter(e => {
        const expDate = new Date(e.date);
        return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
    });

    const spentThisMonth = monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const remaining = monthlyBudget - spentThisMonth;
    const safeDaily = remaining / daysRemaining;

    const prompt = `Calculate safe spending amount:

Monthly Budget: ₹${monthlyBudget.toFixed(2)}
Already Spent: ₹${spentThisMonth.toFixed(2)}
Remaining Budget: ₹${remaining.toFixed(2)}
Days Remaining: ${daysRemaining}
Safe Daily Amount: ₹${safeDaily.toFixed(2)}

Provide clear guidance on safe spending in 2-3 sentences.`;

    return await callGeminiAPI(prompt);
}

/**
 * Detect Expense Anomalies
 */
export async function detectAnomalies(expenses) {
    if (expenses.length < 5) {
        return "You need at least 5 transactions to detect spending anomalies. Keep tracking your expenses.";
    }

    const amounts = expenses.map(e => parseFloat(e.amount));
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / amounts.length);

    const anomalies = expenses.filter(e => {
        const amount = parseFloat(e.amount);
        return Math.abs(amount - avg) > 2 * stdDev;
    });

    if (anomalies.length === 0) {
        return "Your spending is consistent with no unusual transactions detected. Great job maintaining regular spending patterns!";
    }

    const prompt = `Identify unusual transactions:

Average Transaction: ₹${avg.toFixed(2)}
Standard Deviation: ₹${stdDev.toFixed(2)}

Unusual Transactions:
${anomalies.map(e =>
        `₹${parseFloat(e.amount).toFixed(2)} on ${new Date(e.date).toLocaleDateString()} - ${e.description || 'No description'}`
    ).join('\n')}

Explain why these transactions are unusual and provide recommendations. 2-3 sentences.`;

    return await callGeminiAPI(prompt);
}

/**
 * Generate Spending Stability Score
 */
export async function generateStabilityScore(expenses) {
    if (expenses.length < 7) {
        return { score: 50, explanation: "Insufficient data for stability analysis. Please track expenses for at least one week to get an accurate stability score." };
    }

    const amounts = expenses.map(e => parseFloat(e.amount));
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / amounts.length;
    const coefficientOfVariation = Math.sqrt(variance) / avg;

    // Score: lower variation = higher score
    const rawScore = Math.max(0, 100 - (coefficientOfVariation * 100));
    const score = Math.round(Math.min(100, rawScore));

    const prompt = `Analyze financial stability:

Stability Score: ${score}/100
Average Transaction: ₹${avg.toFixed(2)}
Variation: ${(coefficientOfVariation * 100).toFixed(1)}%

Explain what this score means and provide 2-3 actionable tips to improve financial stability.`;

    const explanation = await callGeminiAPI(prompt);

    return { score, explanation };
}

/**
 * Analyze Behavioral Profile
 */
export async function analyzeBehaviorProfile(expenses) {
    if (expenses.length < 10) {
        return "Need at least 10 transactions to analyze your spending behavior. Continue tracking to unlock this insight.";
    }

    const byDayOfWeek = groupByDayOfWeek(expenses);
    const byTimeOfDay = groupByTimeOfDay(expenses);
    const amounts = expenses.map(e => parseFloat(e.amount));
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;

    const highestDay = Object.entries(byDayOfWeek).sort((a, b) => b[1].total - a[1].total)[0];
    const lowestDay = Object.entries(byDayOfWeek).sort((a, b) => a[1].total - b[1].total)[0];

    const prompt = `Analyze spending behavior profile:

Total Transactions: ${expenses.length}
Average Transaction: ₹${avg.toFixed(2)}
Highest Spending Day: ${highestDay[0]} (₹${highestDay[1].total.toFixed(2)})
Lowest Spending Day: ${lowestDay[0]} (₹${lowestDay[1].total.toFixed(2)})

Provide a spending personality profile with strengths and areas for improvement. 3-4 sentences.`;

    return await callGeminiAPI(prompt);
}

/**
 * AI Chat Assistant
 */
export async function chatWithAI(question, expenses, income) {
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const balance = income.amount - totalExpenses;

    const prompt = `Answer this financial question professionally:

Question: "${question}"

Financial Context:
- Income: ₹${income.amount.toFixed(2)}
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Current Balance: ₹${balance.toFixed(2)}
- Total Transactions: ${expenses.length}

Provide a clear, helpful answer with actionable advice. 2-4 sentences.`;

    return await callGeminiAPI(prompt);
}

// Helper Functions

function getDaysBetween(expenses) {
    if (expenses.length === 0) return 1;
    const dates = expenses.map(e => new Date(e.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    return Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1);
}

function groupByDayOfWeek(expenses) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const grouped = {};

    days.forEach(day => {
        grouped[day] = { count: 0, total: 0, avg: 0 };
    });

    expenses.forEach(e => {
        const day = days[new Date(e.date).getDay()];
        grouped[day].count++;
        grouped[day].total += parseFloat(e.amount);
    });

    Object.keys(grouped).forEach(day => {
        if (grouped[day].count > 0) {
            grouped[day].avg = grouped[day].total / grouped[day].count;
        }
    });

    return grouped;
}

function groupByTimeOfDay(expenses) {
    const times = {
        'Morning (6AM-12PM)': { count: 0, total: 0 },
        'Afternoon (12PM-6PM)': { count: 0, total: 0 },
        'Evening (6PM-10PM)': { count: 0, total: 0 },
        'Night (10PM-6AM)': { count: 0, total: 0 }
    };

    expenses.forEach(e => {
        const hour = new Date(e.date).getHours();
        let timeSlot;

        if (hour >= 6 && hour < 12) timeSlot = 'Morning (6AM-12PM)';
        else if (hour >= 12 && hour < 18) timeSlot = 'Afternoon (12PM-6PM)';
        else if (hour >= 18 && hour < 22) timeSlot = 'Evening (6PM-10PM)';
        else timeSlot = 'Night (10PM-6AM)';

        times[timeSlot].count++;
        times[timeSlot].total += parseFloat(e.amount);
    });

    return times;
}

function calculateTrend(expenses) {
    if (expenses.length < 14) return 0;

    const sorted = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
    const midpoint = Math.floor(sorted.length / 2);

    const firstHalf = sorted.slice(0, midpoint);
    const secondHalf = sorted.slice(midpoint);

    const firstAvg = firstHalf.reduce((sum, e) => sum + parseFloat(e.amount), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, e) => sum + parseFloat(e.amount), 0) / secondHalf.length;

    return ((secondAvg - firstAvg) / firstAvg) * 100;
}

/**
 * Generate Budget Recommendations
 */
export async function generateBudgetRecommendations(expenses, income, savingsGoal = 0) {
    if (expenses.length < 5) {
        return "Need at least 5 transactions to generate budget recommendations. Keep tracking your expenses.";
    }

    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const monthlyIncome = income.amount;
    const savingsRate = ((monthlyIncome - totalExpenses) / monthlyIncome) * 100;

    // Group by category
    const categoryTotals = {};
    expenses.forEach(e => {
        const cat = e.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(e.amount);
    });

    const categoryBreakdown = Object.entries(categoryTotals)
        .map(([cat, total]) => `${cat}: ₹${total.toFixed(2)} (${((total / totalExpenses) * 100).toFixed(1)}%)`)
        .join('\n');

    const prompt = `Create personalized budget recommendations:

Monthly Income: ₹${monthlyIncome.toFixed(2)}
Total Spending: ₹${totalExpenses.toFixed(2)}
Current Savings Rate: ${savingsRate.toFixed(1)}%
Savings Goal: ₹${savingsGoal.toFixed(2)}

Category Breakdown:
${categoryBreakdown}

Provide 4-5 specific budget recommendations with suggested amounts for each category to optimize savings and meet financial goals.`;

    return await callGeminiAPI(prompt);
}

/**
 * Analyze Savings Progress
 */
export async function analyzeSavingsProgress(expenses, income, savingsGoals = []) {
    if (savingsGoals.length === 0) {
        return "No savings goals set. Create savings goals to track your progress and get personalized recommendations!";
    }

    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const monthlyIncome = income.amount;
    const currentSavings = monthlyIncome - totalExpenses;

    const goalsInfo = savingsGoals.map(goal => {
        const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1);
        const remaining = goal.targetAmount - goal.currentAmount;
        const monthsRemaining = goal.deadline ?
            Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30)) : 'not set';
        const monthlyRequired = monthsRemaining > 0 ? (remaining / monthsRemaining).toFixed(2) : 0;

        return `Goal: "${goal.name}"
Target: ₹${goal.targetAmount.toFixed(2)}
Current: ₹${goal.currentAmount.toFixed(2)} (${progress}%)
Remaining: ₹${remaining.toFixed(2)}
Months Left: ${monthsRemaining}
Monthly Required: ₹${monthlyRequired}`;
    }).join('\n\n');

    const prompt = `Analyze savings goals progress and provide actionable advice:

Monthly Income: ₹${monthlyIncome.toFixed(2)}
Monthly Expenses: ₹${totalExpenses.toFixed(2)}
Current Monthly Savings: ₹${currentSavings.toFixed(2)}

${goalsInfo}

Provide realistic recommendations on how to adjust spending to meet these goals. Be encouraging but honest.`;

    return await callGeminiAPI(prompt);
}

/**
 * Suggest Expense Category
 */
export async function suggestCategory(description, amount) {
    if (!description || description.trim() === '') {
        return 'Other';
    }

    const prompt = `Based on this expense description and amount, suggest the most appropriate category from: Food, Travel, Shopping, Entertainment, Bills, Other.

Description: "${description}"
Amount: ₹${amount}

Respond with ONLY the category name, nothing else.`;

    try {
        const response = await callGeminiAPI(prompt);
        const category = response.trim();
        const validCategories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Other'];
        return validCategories.includes(category) ? category : 'Other';
    } catch (error) {
        console.error('Category suggestion error:', error);
        return 'Other';
    }
}

/**
 * Predict Upcoming Bills
 */
export async function predictUpcomingBills(expenses) {
    if (expenses.length < 10) {
        return "Need more transaction history to predict recurring bills accurately. Keep tracking your expenses!";
    }

    // Group expenses by description to find recurring patterns
    const expensesByDesc = {};
    expenses.forEach(e => {
        const desc = e.description?.toLowerCase() || 'unknown';
        if (!expensesByDesc[desc]) {
            expensesByDesc[desc] = [];
        }
        expensesByDesc[desc].push({
            amount: parseFloat(e.amount),
            date: new Date(e.date)
        });
    });

    // Find potentially recurring expenses (same description, appeared 2+ times)
    const recurringItems = [];
    Object.entries(expensesByDesc).forEach(([desc, items]) => {
        if (items.length >= 2) {
            const amounts = items.map(i => i.amount);
            const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
            const dates = items.map(i => i.date);
            recurringItems.push({
                description: desc,
                count: items.length,
                avgAmount: avgAmount,
                lastDate: new Date(Math.max(...dates))
            });
        }
    });

    if (recurringItems.length === 0) {
        return "No recurring payment patterns detected yet. Continue tracking to identify recurring bills.";
    }

    const recurringInfo = recurringItems
        .slice(0, 5) // Top 5
        .map(item => `"${item.description}" - ₹${item.avgAmount.toFixed(2)} avg, occurred ${item.count} times, last: ${item.lastDate.toLocaleDateString()}`)
        .join('\n');

    const prompt = `Analyze these recurring expense patterns and predict upcoming bills:

Recurring Transactions:
${recurringInfo}

Identify likely recurring bills (subscriptions, rent, utilities) and predict next payment dates with amounts.`;

    return await callGeminiAPI(prompt);
}

/**
 * Generate Monthly Report
 */
export async function generateMonthlyReport(expenses, income, month, year) {
    const monthExpenses = expenses.filter(e => {
        const expDate = new Date(e.date);
        return expDate.getMonth() === month && expDate.getFullYear() === year;
    });

    if (monthExpenses.length === 0) {
        return `No expenses recorded for ${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}.`;
    }

    const totalExpenses = monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const avgDaily = totalExpenses / new Date(year, month + 1, 0).getDate();

    // Category breakdown
    const categoryTotals = {};
    monthExpenses.forEach(e => {
        const cat = e.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(e.amount);
    });

    const categoryBreakdown = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, total]) => `${cat}: ₹${total.toFixed(2)} (${((total / totalExpenses) * 100).toFixed(1)}%)`)
        .join('\n');

    const monthName = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
    const savingsAmount = income.amount - totalExpenses;
    const savingsRate = ((savingsAmount / income.amount) * 100).toFixed(1);

    const prompt = `Generate a comprehensive monthly financial report for ${monthName}:

Income: ₹${income.amount.toFixed(2)}
Total Expenses: ₹${totalExpenses.toFixed(2)}
Net Savings: ₹${savingsAmount.toFixed(2)}
Savings Rate: ${savingsRate}%
Transaction Count: ${monthExpenses.length}
Average Daily Spend: ₹${avgDaily.toFixed(2)}

Spending by Category:
${categoryBreakdown}

Provide a detailed analysis with:
1. Overall financial health assessment
2. Key spending patterns and insights
3. Comparison with recommended budgets
4. Actionable recommendations for next month
5. Highlighting achievements or concerns`;

    return await callGeminiAPI(prompt);
}
