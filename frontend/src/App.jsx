import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import axios from 'axios';
import botImage from './images/chatbot_law.jpeg';



function App() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Hàm giả lập gọi API
    const callAPI = async (userQuestion) => {
        // Thay thế bằng API thực tế của bạn
        try {
            const response = await axios.post('31.97.51.25:2824/qa', {
                question: userQuestion
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data.answer;

        } catch (error) {
            console.error('Error calling API:', error);
            return "Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn.";
        }
    };

    const handleSendMessage = async () => {
        if (!question.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: question,
            isUser: true,
            timestamp: new Date()
        };

        // Thêm tin nhắn của user
        setMessages(prev => [...prev, userMessage]);
        setQuestion("");
        setIsLoading(true);

        try {
            // Gọi API để lấy câu trả lời
            const apiResponse = await callAPI(question);

            const botMessage = {
                id: Date.now() + 1,
                text: apiResponse,
                isUser: false,
                timestamp: new Date()
            };

            // Thêm tin nhắn của bot
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const resetMessages = () => {
        setMessages([])
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="">
                        <img src={botImage} alt="Bot" className="w-10 h-10 object-contain rounded-full"/>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-800 pl-2">VnLawBot</h1>
                    <button className="btn btn-outline btn-error ml-auto" onClick={() => resetMessages()}>Tải lại</button>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-20">
                        <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">Chào bạn! Tôi có thể giải đáp thắc mắc của bạn về pháp luật hình sự ở Việt Nam?</p>
                        <p className="text-sm mt-2">Ví dụ bạn lỡ trộm cắp tôi có thể cho bạn biết bạn sẽ bị phạt thế nào!</p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-start space-x-3 max-w-3xl ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isUser
                                    ? 'bg-blue-400'
                                    : 'bg-gray-600'
                                }`}>
                                {message.isUser ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <img src={botImage} alt="Bot" className="w-8 h-8 object-contain rounded-full" />
                                )}
                            </div>

                            {/* Message Content */}
                            <div className={`rounded-lg px-4 py-3 ${message.isUser
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                                }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.text}
                                </p>
                                <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                    {message.timestamp.toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-start space-x-3 max-w-3xl">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 px-4 py-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-end space-x-3">
                        <div className="flex-1 relative">
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập câu hỏi của bạn..."
                                className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="1"
                                style={{
                                    minHeight: '44px',
                                    maxHeight: '120px'
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!question.trim() || isLoading}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg p-3 transition-colors duration-200"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Nhấn Enter để gửi, Shift + Enter để xuống dòng
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;