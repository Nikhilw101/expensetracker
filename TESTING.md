# Testing Guide for Expense Management App

## Manual Test Checklist

### 1. Income Management Tests
- [ ] **Add Income**
  - Navigate to Income page (More > Income)
  - Click the + button
  - Enter amount (e.g., 50000)
  - Submit
  - Verify toast notification shows "Income added successfully!"
  - Verify total income updates

- [ ] **Edit Income**
  - Click edit button (pencil icon) on any income history item
  - Change the amount
  - Save
  - Verify toast notification shows "Income updated successfully!"
  - Verify total income recalculates correctly

- [ ] **Delete Income**
  - Click delete button (trash icon) on any income history item
  - Verify confirmation dialog appears
  - Confirm deletion
  - Verify toast notification shows "Income deleted successfully!"
  - Verify total income updates

### 2. Expenses Tests
- [ ] **Add Expense**
  - Navigate to Expenses page
  - Click + button
  - Fill in: amount, category, description, date
  - Submit
  - Verify expense appears in list

- [ ] **Edit Expense**
  - Click on any expense
  - Modify details
  - Save
  - Verify updates are reflected

- [ ] **Delete Expense**
  - Click delete on any expense
  - Confirm deletion
  - Verify expense is removed

### 3. Savings Goals Tests
- [ ] **Create Savings Goal**
  - More > Savings Goals
  - Click + button
  - Fill: name (e.g., "Emergency Fund"), target (₹50000), current (₹10000), deadline, priority
  - Submit
  - Verify goal appears with correct progress bar

- [ ] **Edit Savings Goal**
  - Click edit on a goal
  - Modify details
  - Save
  - Verify changes are saved

- [ ] **Delete Savings Goal**
  - Click delete on a goal
  - Confirm deletion
  - Verify goal is removed

### 4. Recurring Expenses Tests
- [ ] **Create Recurring Expense**
  - More > Recurring Expenses
  - Click + button
  - Fill: name (e.g., "Netflix"), amount (₹199), category, frequency (monthly), start date
  - Submit
  - Verify appears in list with next due date

- [ ] **Mark as Paid**
  - Find a recurring expense with upcoming due date
  - Click "Mark as Paid"
  - Verify expense is added to regular expenses
  - Verify next due date updates

- [ ] **Toggle Active/Inactive**
  - Click the green/checkmark icon to toggle
  - Verify expense becomes inactive (greyed out)
  - Verify monthly total recalculates

### 5. AI Features Tests
- [ ] **Financial Summary**
  - Navigate to AI Insights
  - Wait for AI summary to load
  - Verify summary provides relevant insights about spending

- [ ] **Spending Patterns**
  - Check the spending patterns card
  - Verify it identifies day-of-week or time-of-day patterns

- [ ] **7-Day Forecast**
  - Check the prediction card
  - Verify it provides reasonable spending forecast

- [ ] **Budget Recommendations**
  - Look for personalized budget suggestions
  - Verify they're based on actual spending data

- [ ] **Monthly Report**
  - More > Monthly Report
  - Select current month and year
  - Click "Generate AI Report"
  - Verify comprehensive report is generated

- [ ] **AI Chat**
  - Scroll to AI chat interface in AI Insights
  - Ask a question (e.g., "How can I save more money?")
  - Verify AI responds with relevant advice

### 6. Navigation Tests
- [ ] **Bottom Navigation**
  - Click Home - verify dashboard loads
  - Click Expenses - verify expenses page loads
  - Click AI - verify AI insights loads
  - Click Charts - verify analytics loads
  - Click More - verify menu modal opens

- [ ] **More Menu**
  - Click More button
  - Verify all options are visible: Income, Savings Goals, Recurring Expenses, Spending Limit, Monthly Report, 30-Day Summary, Settings
  - Click each option - verify correct page loads
  - Close menu - verify it closes correctly

### 7. Quick Access Cards (Homepage)
- [ ] Verify homepage shows balance card correctly
- [ ] Verify today's spending progress circle works
- [ ] Verify last 7 days calculation is correct
- [ ] Click each quick access card (Savings Goals, Recurring Bills, AI Insights)
- [ ] Verify navigation works correctly

### 8. Dark Mode Tests
- [ ] Go to Settings
- [ ] Toggle dark mode
- [ ] Verify all pages render correctly in dark mode
- [ ] Check all components: cards, buttons, inputs, dialogs
- [ ] Toggle back to light mode

### 9. Data Persistence Tests
- [ ] Add various data (income, expenses, goals, recurring)
- [ ] Refresh the page
- [ ] Verify all data persists
- [ ] Close and reopen browser
- [ ] Verify data still exists

### 10. Export/Import Tests
- [ ] Go to Settings
- [ ] Click "Export Data"
- [ ] Verify JSON file downloads
- [ ] Click "Reset All Data"
- [ ] Confirm reset
- [ ] Verify all data is cleared
- [ ] Click "Import Data"
- [ ] Select the exported JSON file
- [ ] Verify all data is restored

## Expected Results

All tests should pass with:
- ✅ No console errors
- ✅ Smooth animations and transitions
- ✅ Correct calculations
- ✅ Proper data persistence
- ✅ Responsive UI on different screen sizes
- ✅ Toast notifications for all actions
- ✅ Confirmation dialogs for destructive actions

## Known Limitations

1. **AI Features**: Require API keys to be configured in `.env`
2. **localStorage Limit**: Browser localStorage has ~5-10MB limit
3. **No Backend**: All data is client-side only
4. **No Sync**: Data doesn't sync across devices

## Browser Compatibility

Tested on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (Chrome, Safari)
