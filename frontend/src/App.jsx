import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const callAPI = async (userQuestion) => {
    try {
      const response = await axios.post(
        "https://vnlawbot.hoanglvuit.id.vn/qa",
        { question: userQuestion },
        { 
          headers: { "Content-Type": "application/json" },
          timeout: 30000 // 30 seconds timeout
        }
      );

      return response.data.answer;
    } catch (error) {
      if (error.response) {
        // Server phản hồi lỗi (status code != 2xx)
        console.error(
          "API response error:",
          error.response.status,
          error.response.statusText,
          error.response.data
        );
        return "Xin lỗi, có lỗi xảy ra từ phía server. Vui lòng thử lại sau.";
      } else if (error.request) {
        // Không có phản hồi từ server
        console.error("No response received from API:", error.request);
        return "Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.";
      } else {
        // Lỗi thiết lập request
        console.error("Error setting up API request:", error.message);
        return "Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn. Vui lòng thử lại.";
      }
    }
  };

  const handleSendMessage = async (question) => {
    if (!question.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: question.trim(),
      isUser: true,
      timestamp: new Date()
    };

    // Thêm tin nhắn của user
    setMessages(prev => [...prev, userMessage]);
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
      console.error("Unexpected error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Xin lỗi, có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetMessages = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện?')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header onReset={resetMessages} />
      <MessageList messages={messages} isLoading={isLoading} />
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;