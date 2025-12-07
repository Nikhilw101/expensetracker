import React, { useState } from 'react';
import { Target, Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ConfirmDialog from '../components/ConfirmDialog';

const SavingsGoals = () => {
    const { darkMode } = useApp();
    const [savingsGoals, setSavingsGoals] = useState(
        JSON.parse(localStorage.getItem('savingsGoals') || '[]')
    );
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        priority: 'medium'
    });
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, index: null, name: '' });

    // Save to localStorage whenever goals change
    const saveGoals = (goals) => {
        localStorage.setItem('savingsGoals', JSON.stringify(goals));
        setSavingsGoals(goals);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newGoal = {
            ...formData,
            id: editingIndex !== null ? savingsGoals[editingIndex].id : Date.now(),
            targetAmount: parseFloat(formData.targetAmount),
            currentAmount: parseFloat(formData.currentAmount || 0)
        };

        let updatedGoals;
        if (editingIndex !== null) {
            updatedGoals = [...savingsGoals];
            updatedGoals[editingIndex] = newGoal;
        } else {
            updatedGoals = [...savingsGoals, newGoal];
        }

        saveGoals(updatedGoals);
        resetForm();
    };

    const handleEdit = (index) => {
        setFormData(savingsGoals[index]);
        setEditingIndex(index);
        setShowForm(true);
    };

    const handleDelete = (index) => {
        const updatedGoals = savingsGoals.filter((_, i) => i !== index);
        saveGoals(updatedGoals);
        setDeleteConfirm({ show: false, index: null, name: '' });
    };

    const handleAddProgress = (index, amount) => {
        const updatedGoals = [...savingsGoals];
        updatedGoals[index].currentAmount += parseFloat(amount);
        saveGoals(updatedGoals);
    };

    const resetForm = () => {
        setFormData({ name: '', targetAmount: '', currentAmount: '', deadline: '', priority: 'medium' });
        setEditingIndex(null);
        setShowForm(false);
    };

    const getProgressColor = (progress) => {
        if (progress >= 100) return 'from-green-500 to-emerald-500';
        if (progress >= 75) return 'from-blue-500 to-cyan-500';
        if (progress >= 50) return 'from-yellow-500 to-orange-500';
        return 'from-orange-500 to-red-500';
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-500';
            case 'medium': return 'text-yellow-500';
            case 'low': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="pb-20 px-4 pt-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl">
                        <Target size={28} className="text-white" />
                    </div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Savings Goals
                    </h1>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 mb-6 shadow-lg`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {editingIndex !== null ? 'Edit Goal' : 'Add New Goal'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Goal name (e.g., Emergency Fund)"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Target amount (₹)"
                            value={formData.targetAmount}
                            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                            min="1"
                            step="0.01"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Current amount (₹)"
                            value={formData.currentAmount}
                            onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                            min="0"
                            step="0.01"
                        />
                        <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                        />
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            className={`w-full p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none`}
                        >
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold active:scale-95 transition-transform"
                            >
                                {editingIndex !== null ? 'Update' : 'Add Goal'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className={`flex-1 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} py-4 rounded-2xl font-semibold active:scale-95 transition-transform`}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Goals List */}
            <div className="space-y-4">
                {savingsGoals.length === 0 ? (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 text-center`}>
                        <Target size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No savings goals yet. Create one to start tracking your progress!
                        </p>
                    </div>
                ) : (
                    savingsGoals.map((goal, index) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        const remaining = goal.targetAmount - goal.currentAmount;
                        const daysLeft = goal.deadline ?
                            Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;

                        return (
                            <div
                                key={goal.id}
                                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-lg`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                            {goal.name}
                                        </h3>
                                        <p className={`text-sm ${getPriorityColor(goal.priority)} font-semibold capitalize`}>
                                            {goal.priority} Priority
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} active:scale-95 transition-transform`}
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm({ show: true, index, name: goal.name })}
                                            className={`p-2 rounded-full ${darkMode ? 'bg-red-900 bg-opacity-30 text-red-400' : 'bg-red-100 text-red-600'} active:scale-95 transition-transform`}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                            ₹{goal.currentAmount.toFixed(2)} / ₹{goal.targetAmount.toFixed(2)}
                                        </span>
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                            {progress.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500`}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Remaining</p>
                                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                            ₹{remaining.toFixed(2)}
                                        </p>
                                    </div>
                                    {daysLeft && (
                                        <div>
                                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Days Left</p>
                                            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                {daysLeft > 0 ? daysLeft : 'Overdue'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {progress >= 100 && (
                                    <div className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-2xl text-center font-semibold flex items-center justify-center gap-2">
                                        <TrendingUp size={20} />
                                        Goal Achieved! 🎉
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                show={deleteConfirm.show}
                title="Delete Goal"
                message={`Are you sure you want to delete the goal "${deleteConfirm.name}"? This action cannot be undone.`}
                onConfirm={() => handleDelete(deleteConfirm.index)}
                onCancel={() => setDeleteConfirm({ show: false, index: null, name: '' })}
                darkMode={darkMode}
                type="danger"
            />
        </div>
    );
};

export default SavingsGoals;
