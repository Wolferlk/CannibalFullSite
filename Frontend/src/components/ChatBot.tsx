import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const initialBotMessage = {
    text: "Hi! I'm Cannibal.co AI Assistant. How can I help you today?",
    isUser: false
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage = {
      text: inputMessage,
      isUser: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        text: "Thank you for your message. Our team will get back to you shortly!",
        isUser: false
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/90 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-white" />
              <h3 className="text-white font-semibold">AI Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-4">
                Start chatting with our AI assistant
              </div>
            )}
            
            {[initialBotMessage, ...messages].map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.isUser
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 rounded-xl px-4 py-2 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-black rounded-full shadow-lg hover:bg-gray-800 transition-all hover:scale-105"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;