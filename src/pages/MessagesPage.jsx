import { useState } from 'react';
import { MessageCircle, Send, CheckCheck } from 'lucide-react';
import { mockMessages } from '../data';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(mockMessages[0]);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'customer', text: 'Hi Lakshmi ji, I would like to book a maths tuition session for my daughter.', time: '10:30 AM' },
    { sender: 'me', text: 'Hello Priya! I would be glad to help. Saturday morning at 10 AM works well for me.', time: '10:32 AM' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'me', text: input, time: 'Just now' }]);
    setInput('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 safe-bottom">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Messages</h2>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
        {/* Chat List */}
        <div className="border-r border-gray-100 overflow-y-auto">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setActiveChat(msg)}
              className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                activeChat.id === msg.id ? 'bg-primary-50/60' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-gray-800 text-xs">{msg.senderName}</h4>
                <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{msg.content}</p>
            </div>
          ))}
        </div>

        {/* Active Chat Conversation */}
        <div className="md:col-span-2 flex flex-col h-full bg-lavender-50/50">
          {/* Active Chat Header */}
          <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-bg text-white font-bold flex items-center justify-center text-xs">
              {activeChat.senderName.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">{activeChat.senderName}</h4>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">● Online</span>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs ${
                  m.sender === 'me' ? 'gradient-bg text-white rounded-br-none' : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed">{m.text}</p>
                  <span className={`text-[9px] block text-right mt-1 ${m.sender === 'me' ? 'text-white/70' : 'text-gray-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-50 px-4 py-2.5 rounded-xl text-xs font-medium outline-none text-gray-700"
            />
            <button type="submit" className="p-2.5 gradient-bg text-white rounded-xl shadow-sm">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
