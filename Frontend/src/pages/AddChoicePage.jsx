import { useNavigate } from 'react-router-dom';
import { PlusCircle, Sparkles, ShoppingBag, Mic, Lightbulb, Users } from 'lucide-react';

export default function AddChoicePage() {
  const navigate = useNavigate();

  const choices = [
    { title: 'Offer a Service', desc: 'Tutoring, cooking, tailoring, mentoring...', icon: '📚', color: 'from-violet-500 to-purple-600', path: '/pricing-assistant' },
    { title: 'Sell a Product', desc: 'Handmade crafts, pickles, snacks, art...', icon: '🛍️', color: 'from-pink-500 to-rose-600', path: '/products' },
    { title: 'Share My Skills (Voice)', desc: 'Tell SilverHands AI your experience & hobbies', icon: '🎙️', color: 'from-amber-500 to-orange-600', path: '/onboarding' },
    { title: 'Find an Opportunity', desc: 'Discover high demand paths tailored to you', icon: '💡', color: 'from-emerald-500 to-teal-600', path: '/opportunities' },
    { title: 'Create a Workshop', desc: 'Host live online or offline group classes', icon: '👩‍🏫', color: 'from-blue-500 to-indigo-600', path: '/pricing-assistant' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 safe-bottom">
      <div className="text-center mb-8 fade-in">
        <div className="w-14 h-14 rounded-2xl gradient-bg mx-auto flex items-center justify-center text-white mb-3 shadow-lg shadow-primary-300/40">
          <PlusCircle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800">What would you like to offer?</h2>
        <p className="text-xs text-gray-500 mt-1">Select an option below. SilverAI will assist you in setting it up.</p>
      </div>

      <div className="space-y-3">
        {choices.map((c) => (
          <div
            key={c.title}
            onClick={() => navigate(c.path)}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center text-2xl shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
              {c.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-gray-800 text-sm group-hover:text-primary-700 transition-colors">{c.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
