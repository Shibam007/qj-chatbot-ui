import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  History, 
  Menu, 
  TrendingUp, 
  HelpCircle, 
  Plus, 
  ChevronDown,
  Settings,
  LogOut,
  MessageSquare
} from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI Financial Assistant. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Financial Analysis');
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [chatHistory] = useState([
    { id: 1, title: 'Q1 Spend Breakdown', date: 'May 28, 2025 • 11:42 AM', status: 'Resume' },
    { id: 2, title: 'Market Analysis Discussion', date: 'May 27, 2025 • 09:15 AM', status: 'Complete' },
    { id: 3, title: 'Portfolio Review', date: 'May 26, 2025 • 16:30 PM', status: 'Complete' },
    { id: 4, title: 'Investment Strategy', date: 'May 25, 2025 • 14:22 PM', status: 'Complete' }
  ]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const analysisOptions = [
    { value: 'Financial Analysis', icon: TrendingUp, color: '#10B981' },
    { value: 'General Query', icon: HelpCircle, color: '#3B82F6' }
  ];

  const suggestions = [
    'View supplier spend trends in Q1',
    'Compare YoY revenue across regions',
    'Analyze customer churn patterns',
    'Review quarterly budget allocation'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Replace with your Flask API endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          option: selectedMode 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: data.response || 'I apologize, but I couldn\'t process your request at the moment. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: 'I\'m experiencing some technical difficulties. Please check your connection and try again.',
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
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const selectedModeData = analysisOptions.find(opt => opt.value === selectedMode);

  return (
    <div className="h-screen bg-gray-900 text-white flex overflow-hidden">
      {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
              QJeIS
            </div>
            <span className="font-semibold text-lg">Dashboard</span>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 text-sm hover:bg-gray-700 rounded-lg px-2 py-1 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>User</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 py-2 z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4" style={{display: 'none'}}>
          <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Recent Conversations */}
        <div className="px-4 pb-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Conversations</h3>
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <div key={chat.id} className="p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-white truncate">{chat.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{chat.date}</p>
                  </div>
                  {/* <span className={`text-xs px-2 py-1 rounded ${chat.status === 'Resume' ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-300'}`}>
                    {chat.status}
                  </span> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="px-4 border-t border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Smart Suggestions</h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                className="w-full text-left p-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle Button */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* New Chat Button */}
            <button 
              onClick={() => {
                setMessages([{
                  id: 1,
                  type: 'bot',
                  content: 'Hello! I\'m your AI Financial Assistant. How can I assist you today?',
                  timestamp: new Date()
                }]);
              }}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">New Chat</span>
            </button>
            
            {/* QJeIS Logo and Title */}
            <div className="flex items-center space-x-3">
              {/* <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                QJeIS
              </div> */}
              <div>
                <h1 className="font-semibold text-lg">QJeIS</h1>
              </div>
            </div>
          </div>

          {/* Mode Selection Dropdown */}
          <div className="relative">
            <button
              onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors"
            >
              {selectedModeData && <selectedModeData.icon className="w-4 h-4" style={{color: selectedModeData.color}} />}
              <span className="text-sm font-medium">{selectedMode}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {modeDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-600 py-2 z-50">
                {analysisOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedMode(option.value);
                        setModeDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center space-x-3"
                    >
                      <IconComponent className="w-4 h-4" style={{color: option.color}} />
                      <span className="text-sm">{option.value}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start space-x-4"
              >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                
                <div className="max-w-3xl">
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    <div 
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  </div>
                  <p className={`text-xs text-gray-500 mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>

              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-gray-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 p-4 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  disabled={isLoading}
                  rows={1}
                  className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{minHeight: '48px', maxHeight: '120px'}}
                />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full p-3 transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Overlay for sidebar */}
      {/* {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )} */}
    </div>
  );
};

export default ChatInterface;