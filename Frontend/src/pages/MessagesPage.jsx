import { useState, useEffect } from 'react';
import { MessageCircle, Send, CheckCheck } from 'lucide-react';
import { mockMessages } from '../data';
import { api } from '../api';
import { useApp } from '../context';

export default function MessagesPage() {
  const { accessToken, currentUser } = useApp();

  const [conversations, setConversations] = useState(mockMessages);
  const [activeChat, setActiveChat] = useState(mockMessages[0]);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'customer', text: 'Hi Lakshmi ji, I would like to book a maths tuition session for my daughter.', time: '10:30 AM' },
    { sender: 'me', text: 'Hello Priya! I would be glad to help. Saturday morning at 10 AM works well for me.', time: '10:32 AM' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  // Fetch real conversations from backend when logged in
  useEffect(() => {
    if (accessToken) {
      api('/messages/conversations', { token: accessToken })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((msg) => {
              const otherUser =
                msg.senderId?._id === currentUser?._id || msg.senderId?.id === currentUser?.id
                  ? msg.receiverId
                  : msg.senderId;

              return {
                id: msg.conversationId,
                otherUserId: otherUser?._id || otherUser?.id,
                senderName: otherUser?.name || 'SilverHands Member',
                content: msg.text,
                timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unread: !msg.isRead,
              };
            });
            setConversations(mapped);
            setActiveChat(mapped[0]);
          }
        })
        .catch(() => {
          // Keep mock conversations
        });
    }
  }, [accessToken]);

  // Fetch conversation messages when active chat changes
  useEffect(() => {
    if (accessToken && activeChat?.otherUserId) {
      api(`/messages/conversations/${activeChat.otherUserId}`, { token: accessToken })
        .then((messages) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setChatMessages(
              messages.map((m) => ({
                sender:
                  m.senderId?._id === currentUser?._id || m.senderId === currentUser?._id
                    ? 'me'
                    : 'customer',
                text: m.text,
                time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [activeChat, accessToken]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentText = input.trim();
    const newLocalMsg = {
      sender: 'me',
      text: currentText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newLocalMsg]);
    setInput('');

    if (accessToken && activeChat?.otherUserId) {
      try {
        setBusy(true);
        await api('/messages/send', {
          method: 'POST',
          body: {
            receiverId: activeChat.otherUserId,
            text: currentText,
          },
          token: accessToken,
        });
      } catch (err) {
        // Message already appended locally
      } finally {
        setBusy(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 safe-bottom">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Messages</h2>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
        {/* Chat List */}
        <div className="border-r border-gray-100 overflow-y-auto">
          {conversations.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setActiveChat(msg)}
              className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                activeChat?.id === msg.id ? 'bg-primary-50/60' : 'hover:bg-gray-50'
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
              {(activeChat?.senderName || 'U').charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">{activeChat?.senderName || 'Conversation'}</h4>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">● Online</span>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs ${
                    m.sender === 'me'
                      ? 'gradient-bg text-white rounded-br-none'
                      : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <span
                    className={`text-[9px] block text-right mt-1 ${
                      m.sender === 'me' ? 'text-white/70' : 'text-gray-400'
                    }`}
                  >
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
            <button type="submit" disabled={busy || !input.trim()} className="p-2.5 gradient-bg text-white rounded-xl shadow-sm disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
