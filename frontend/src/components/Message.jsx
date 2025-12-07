import React from 'react';
import { User, Bot } from 'lucide-react';
import botImage from '../images/chatbot_law.jpeg';

const Message = ({ message }) => {
  const isUser = message.isUser;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`flex items-start gap-3 max-w-[85%] sm:max-w-[75%] md:max-w-[65%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-md' 
            : 'bg-gradient-to-br from-gray-600 to-gray-700 shadow-md'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <img 
              src={botImage} 
              alt="Bot" 
              className="w-8 h-8 object-cover rounded-full"
            />
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-white text-gray-800 border border-gray-200'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
          <p className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;

