import React from 'react';
import { RotateCcw } from 'lucide-react';
import botImage from '../images/chatbot_law.jpeg';

const Header = ({ onReset }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={botImage} 
                alt="VnLawBot" 
                className="w-10 h-10 object-cover rounded-full ring-2 ring-blue-100"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">VnLawBot</h1>
              <p className="text-xs text-gray-500">Trợ lý pháp luật thông minh</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-200"
            title="Xóa lịch sử trò chuyện"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Tải lại</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

