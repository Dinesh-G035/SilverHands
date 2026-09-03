import { useState, useRef, useEffect } from "react";
import { X, Send, Mic, MicOff, Sparkles } from "lucide-react";

const aiResponses = {
  earn: "🍳 **Cooking Classes** — ₹500-800/session\n🏠 **Home Delivery Meals** — ₹200-500/order\n📚 **Recipe Workshops** — ₹1,000-2,000/workshop\n🎁 **Festival Packages** — ₹2,000-5,000/package\n\nWould you like me to help you set up any of these?",
  charge:
    "📊 **Market Rate**: ₹300 – ₹500/hour\n📍 **Your Location**: Chennai\n⭐ **Your Experience**: 20+ years (premium bracket)\n\n💡 **Recommended Price**: ₹400/hour\n\nThis is competitive yet reflects your expertise.",
  customers:
    "1. 🔍 **Complete your profile** — 90% more visibility\n2. 📸 **Add photos** of your work\n3. ⭐ **Ask for reviews** from existing customers\n4. 📍 **Enable location** for nearby discovery\n5. 🗓️ **Update availability** regularly",
  profile:
    "✅ Add a professional photo\n✅ Write a compelling bio\n✅ List all your skills with details\n✅ Add certifications if any\n✅ Set competitive pricing\n✅ Enable availability calendar\n\nShall I generate a bio for you based on your skills?",
  products:
    "🫙 **Homemade Pickles** — ₹150-300 each\n🍪 **Traditional Snacks** — ₹100-250/pack\n🍬 **Festival Sweets** — ₹300-800/box\n🌶️ **Spice Mixes** — ₹100-200/pack\n\nWant to list any of these on the marketplace?",
  default:
    "I'm SilverAI, your personal assistant! 🌟\n\nI can help you with:\n• Finding earning opportunities\n• Setting the right price\n• Finding customers near you\n• Improving your profile\n• Listing products to sell\n\nJust ask me anything!",
};

function getAIResponse(message) {
  const lower = message.toLowerCase();
  if (
    lower.includes("earn") ||
    lower.includes("income") ||
    lower.includes("money")
  )
    return aiResponses.earn;
  if (
    lower.includes("charge") ||
    lower.includes("price") ||
    lower.includes("cost")
  )
    return aiResponses.charge;
  if (
    lower.includes("customer") ||
    lower.includes("find") ||
    lower.includes("more")
  )
    return aiResponses.customers;
  if (lower.includes("profile") || lower.includes("improve"))
    return aiResponses.profile;
  if (
    lower.includes("product") ||
    lower.includes("sell") ||
    lower.includes("make")
  )
    return aiResponses.products;
  return aiResponses.default;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "0",
      role: "ai",
      content:
        "Hello! I'm **SilverAI** 🌟\n\nHow can I help you today? You can ask me about earning from your skills, pricing, finding customers, or anything else!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = getAIResponse(input);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "ai", content: response },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInput("How can I earn from my skills?");
      }, 2000);
    }
  };

  const quickQuestions = [
    "How can I earn from my skills?",
    "What should I charge?",
    "Find customers near me",
    "Help me improve my profile",
  ];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 w-14 h-14 rounded-full gradient-bg shadow-xl shadow-primary-400/30 flex items-center justify-center text-white hover:scale-105 transition-transform active:scale-95"
          id="ai-assistant-fab"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed bottom-0 right-0 md:bottom-8 md:right-8 z-50 w-full md:w-[400px] h-[85vh] md:h-[600px] md:rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden fade-in"
          id="ai-assistant-panel"
        >
          <div className="gradient-bg px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">SilverAI</h3>
                <p className="text-white/70 text-xs">Your personal assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10 text-white/80"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-lavender-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "gradient-bg text-white rounded-br-md" : "bg-white text-gray-700 rounded-bl-md shadow-sm border border-gray-50"}`}
                >
                  {msg.content
                    .split("**")
                    .map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
                    )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-50">
                  <div className="ai-dots flex gap-1">
                    <span className="w-2 h-2 bg-primary-400 rounded-full inline-block"></span>
                    <span className="w-2 h-2 bg-primary-400 rounded-full inline-block"></span>
                    <span className="w-2 h-2 bg-primary-400 rounded-full inline-block"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 bg-white border-t border-gray-50">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium hover:bg-primary-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-2">
              <button
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-colors ${isListening ? "bg-red-100 text-red-500 mic-pulse" : "hover:bg-gray-200 text-gray-400"}`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-2 rounded-xl gradient-bg text-white disabled:opacity-40 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
