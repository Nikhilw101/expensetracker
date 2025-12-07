# 💰 Hostel Money Manager

A modern, mobile-first Money Management App specifically designed for hostel students. Built with React 19, featuring localStorage-based data persistence, beautiful UI with dark mode, and comprehensive expense tracking.

## ✨ Features

### 📊 Core Functionality
- **Income Management**: Add, edit, and delete income entries with history tracking
- **Expense Tracking**: Full CRUD operations for expenses with categories
- **Recurring Expenses**: Track subscriptions, bills, and recurring payments with auto-reminders
- **Savings Goals**: Set and track multiple financial goals with progress visualization
- **Spending Limits**: Set daily spending limits with visual alerts
- **Auto Summaries**: Automatic 30-day financial summaries
- **Analytics**: Beautiful charts showing spending patterns and trends
- **Monthly Reports**: AI-generated comprehensive monthly financial reports
- **Data Persistence**: All data stored in localStorage (no backend needed)

### 🤖 AI-Powered Features
- **AI Financial Summary**: Intelligent overview of your financial health
- **Spending Pattern Analysis**: AI detects overspending patterns and trends
- **Future Expense Predictions**: 7-day spending forecast
- **Budget Recommendations**: Personalized budget suggestions per category
- **Savings Goal Analysis**: AI-powered advice to reach your goals faster
- **Bill Payment Predictions**: Identifies recurring bills and predicts due dates
- **Anomaly Detection**: Flags unusual transactions
- **Stability Score**: Financial stability assessment
- **Spending Personality**: Behavioral spending profile analysis
- **AI Chat Assistant**: Ask questions about your finances
- **Expense Categorization**: Smart category suggestions for new expenses

### 🎨 UI/UX Features
- **Mobile-First Design**: Optimized for thumb-friendly navigation
- **Dark/Light Mode**: Toggle between themes
- **Smooth Animations**: Polished transitions and interactions
- **Responsive Charts**: Interactive pie and bar charts
- **Toast Notifications**: Real-time feedback for all actions

### 💾 Data Management
- **Export Data**: Download your data as JSON
- **Import Data**: Restore from backup
- **Reset Option**: Clear all data when needed

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- **AI API Keys** (Optional but recommended for AI features):
  - Gemini API Key from [Google AI Studio](https://makersuite.google.com/app/apikey)
  - Groq API Key from [Groq Console](https://console.groq.com) (fallback)

### Installation

1. **Clone or Download the Repository**
```bash
git clone <repository-url>
cd expense-management
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure AI API Keys** (Optional)

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```
   
   > **Note**: The app works without API keys, but AI features will be limited. Gemini is the primary AI provider, with Groq as a fallback.

4. **Run Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
```

4. **Preview Production Build**
```bash
npm run preview
```

## 📁 Project Structure

```
expense-management/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AddExpenseForm.jsx
│   │   ├── AddIncomeForm.jsx
│   │   ├── BottomNav.jsx
│   │   ├── ExpenseItem.jsx
│   │   ├── IncomeCard.jsx
│   │   ├── LimitProgressCircle.jsx
│   │   └── Toast.jsx
│   ├── contexts/            # React Context for state management
│   │   └── AppContext.jsx
│   ├── hooks/               # Custom React hooks
│   │   └── useLocalStorage.js
│   ├── pages/               # Main application pages
│   │   ├── Analytics.jsx
│   │   ├── Expenses.jsx
│   │   ├── Home.jsx
│   │   ├── Income.jsx
│   │   ├── Limit.jsx
│   │   ├── Settings.jsx
│   │   └── Summary.jsx
│   ├── utils/               # Utility functions
│   │   ├── calculateBalance.js
│   │   └── generateSummary.js
│   ├── App.jsx              # Main app component
│   ├── index.jsx            # React entry point
│   └── index.css            # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Usage Guide

### Adding Income
1. Navigate to the **Income** page
2. Click the **+** button
3. Enter the amount and submit

### Adding Expenses
1. Go to the **Expenses** page
2. Click the **+** button
3. Fill in amount, category, description, and date
4. Submit the form

### Setting Spending Limit
1. Visit the **Limit** page
2. Click **Edit Limit**
3. Enter your daily spending limit
4. Save changes

### Viewing Analytics
- Navigate to **Analytics** to see:
  - Category-wise spending (Pie Chart)
  - Last 7 days spending (Bar Chart)
  - Total income vs expenses

### Exporting/Importing Data
1. Go to **Settings**
2. Click **Export Data** to download JSON backup
3. Click **Import Data** to restore from backup

## 🛠️ Technology Stack

- **React 19**: Latest React with functional components
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Recharts**: Beautiful, composable charts
- **Lucide React**: Modern icon library
- **Context API**: State management
- **localStorage**: Client-side data persistence

## 📱 Mobile Optimization

- Touch-friendly buttons (minimum 44x44px)
- Sticky bottom navigation
- Optimized viewport settings
- Smooth scroll behavior
- No zoom on input focus

## 🎨 Design Features

- **Neumorphic Cards**: Modern card-based design
- **Gradient Backgrounds**: Beautiful color gradients
- **Rounded Corners**: Consistent 20px border radius
- **Color-Coded Alerts**: Visual feedback for spending limits
- **Smooth Transitions**: All interactions are animated

## 📊 Categories

- Food
- Travel
- Shopping
- Entertainment
- Bills
- Other

## 🔒 Privacy

All data is stored locally in your browser's localStorage. No data is sent to any server. Your financial information stays completely private on your device.

## 🐛 Troubleshooting

### localStorage Quota Exceeded
If you see quota errors:
1. Export your data
2. Reset all data in Settings
3. Import your backup

### Charts Not Displaying
Ensure you have expenses added to see charts in Analytics.

## 📄 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📞 Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Made with ❤️ for Hostel Students**
