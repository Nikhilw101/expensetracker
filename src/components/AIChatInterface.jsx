import React, { useState } from 'react';
import { Send } from 'lucide-react';

const AIChatInterface = ({ onSendMessage, darkMode }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        {
            type: 'ai',
            text: '👋 Hi! I\'m your AI financial assistant. Ask me anything about your spending!'
        }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim() || loading) return;

        const userMessage = message.trim();
        setMessage('');

        // Add user message to chat
        setChatHistory(prev => [...prev, { type: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const response = await onSendMessage(userMessage);
            setChatHistory(prev => [...prev, { type: 'ai', text: response }]);
        } catch (error) {
            setChatHistory(prev => [...prev, {
                type: 'ai',
                text: '❌ Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                AI Assistant
            </h3>

            {/* Chat messages */}
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl ${msg.type === 'user'
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                                    : darkMode
                                        ? 'bg-gray-700 text-gray-200'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <div className="flex gap-1">
                                <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                                <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                                <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your spending..."
                    className={`flex-1 p-4 rounded-2xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                        } outline-none`}
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || loading}
                    className={`p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white active:scale-95 transition-transform ${(!message.trim() || loading) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <Send size={20} />
                </button>
            </div>

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
                {[
                    'How much can I spend this week?',
                    'What\'s my biggest spending habit?',
                    'Am I saving enough?'
                ].map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => setMessage(suggestion)}
                        className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            } active:scale-95 transition-transform`}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AIChatInterface;
