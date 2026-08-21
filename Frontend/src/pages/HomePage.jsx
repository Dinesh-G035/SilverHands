import { useState, useEffect } from 'react';
import { Search, Mic, ArrowRight, Sparkles, ShieldCheck, Clock, IndianRupee, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { api } from '../api';

export default function HomePage() {
  const navigate = useNavigate();
  const { setCurrentTab } = useApp();

  const [topProviders, setTopProviders] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [servicesCount, setServicesCount] = useState(0);

  useEffect(() => {
    // Dynamically fetch live published services from backend
    api('/services?limit=10')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServicesCount(data.length);

          // Extract dynamic top providers
          const mapped = data.slice(0, 3).map((s) => ({
            id: s.provider?.id || s.provider?._id || s.id,
            name: s.provider?.name || 'SilverHands Provider',
            skill: s.title,
            exp: `${s.yearsOfExperience || 15}+ years`,
            rating: s.rating || 4.9,
            city: s.city || 'Chennai',
            color: 'gradient-bg',
            verified: s.provider?.verificationStatus?.identityVerified ?? true,
          }));

          if (mapped.length > 0) {
            setTopProviders(mapped);
          }

          // Count categories dynamically
          const counts = {};
          data.forEach((s) => {
            if (s.category) counts[s.category] = (counts[s.category] || 0) + 1;
          });

          setCategoriesList(Object.entries(counts).map(([name, count], index) => ({
            id: name,
            name,
            count,
            icon: ['📚', '🍳', '🧵', '🌿'][index % 4],
          })));
        }
      })
      .catch(() => {});
  }, []);

  const quickActions = [
    { label: 'Find Services', emoji: '🔍', desc: 'Discover local experts', path: '/services', color: 'from-violet-500 to-purple-600' },
    { label: 'Explore Products', emoji: '🛍️', desc: 'Handmade goods', path: '/products', color: 'from-pink-500 to-rose-600' },
    { label: 'Offer My Skills', emoji: '✋', desc: 'Start earning today', path: '/onboarding', color: 'from-amber-500 to-orange-600' },
    { label: 'Find Opportunities', emoji: '💡', desc: 'AI-matched for you', path: '/opportunities', color: 'from-emerald-500 to-teal-600' },
  ];

  const whyCards = [
    { icon: Sparkles, title: 'AI Powered Matching', desc: 'Smart AI connects you with the right opportunities and customers', color: 'text-primary-600 bg-primary-50' },
    { icon: ShieldCheck, title: 'Trusted & Verified', desc: 'Every provider is verified for a safe and trusted experience', color: 'text-emerald-600 bg-emerald-50' },
    { icon: Clock, title: 'Flexible Work', desc: 'Work on your own terms. Choose your timings and services', color: 'text-blue-600 bg-blue-50' },
    { icon: IndianRupee, title: 'Earn From Skills', desc: 'Turn your lifelong skills and hobbies into a sustainable income', color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="safe-bottom">
      {/* Hero Section */}
      <section className="relative overflow-hidden" id="hero-section">
        <div className="gradient-bg px-4 pt-8 pb-20 md:pb-24 md:pt-16">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white/90 text-sm font-medium">AI-Powered Livelihood Platform</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                Turn Your Skills Into{' '}
                <span className="text-yellow-300">Opportunities</span>
              </h2>
              <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
                Share what you know. Find customers. Earn from your experience.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/onboarding')}
                  className="px-6 py-3.5 bg-white text-primary-700 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                  id="cta-tell-skills"
                >
                  Tell Us Your Skills
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { setCurrentTab('explore'); navigate('/services'); }}
                  className="px-6 py-3.5 bg-white/15 backdrop-blur-sm text-white rounded-2xl font-semibold text-base border border-white/20 hover:bg-white/25 transition-all"
                  id="cta-explore"
                >
                  Explore Services
                </button>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
          <div className="absolute -right-10 top-40 w-40 h-40 rounded-full bg-white/5 pointer-events-none"></div>
        </div>
      </section>

      {/* AI Search Bar */}
      <section className="px-4 -mt-8 relative z-10 max-w-3xl mx-auto" id="ai-search-widget">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-2 border border-gray-100">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => navigate('/ai-search')}
          >
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <span className="text-gray-400 text-base flex-1">What are you looking for?</span>
            <button
              className="p-2 rounded-xl bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
              onClick={(e) => { e.stopPropagation(); navigate('/ai-search'); }}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 px-4 pb-1">
            Try: "I need a Tamil tutor near me" or "homemade pickles in Chennai"
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 mt-8 max-w-7xl mx-auto" id="quick-actions">
        <h3 className="text-xl font-bold text-gray-800 mb-4">What would you like to do?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left"
              id={`qa-${action.label.replace(/\s/g, '-').toLowerCase()}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                {action.emoji}
              </div>
              <h4 className="font-bold text-gray-800 text-sm">{action.label}</h4>
              <p className="text-xs text-gray-400 mt-1">{action.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Why SilverHands */}
      <section className="px-4 mt-10 max-w-7xl mx-auto" id="why-silverhands">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Why SilverHands?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {whyCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{card.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="px-4 mt-10 max-w-7xl mx-auto" id="popular-categories">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Popular Categories</h3>
          <button
            onClick={() => { setCurrentTab('explore'); navigate('/services'); }}
            className="text-primary-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {categoriesList.map((cat) => (
            <button
              key={cat.id || cat.name}
              onClick={() => navigate('/services')}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-semibold text-gray-700 text-center">{cat.name}</span>
              <span className="text-[10px] text-gray-400">{cat.count} listings</span>
            </button>
          ))}
        </div>
      </section>

      {/* Top Rated Providers */}
      <section className="px-4 mt-10 max-w-7xl mx-auto" id="featured-providers">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Top Rated Community Experts</h3>
          <button
            onClick={() => navigate('/services')}
            className="text-primary-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {topProviders.map((provider) => (
            <div
              key={provider.id || provider.name}
              onClick={() => navigate(`/provider/${provider.id}`)}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {provider.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1">
                    {provider.name}
                    {provider.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </h4>
                  <p className="text-xs text-gray-500">{provider.skill}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{provider.exp} • {provider.city || 'Chennai'}</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-bold text-gray-700">{provider.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="px-4 mt-10 mb-10 max-w-7xl mx-auto" id="impact-stats">
        <div className="gradient-bg rounded-2xl p-6 md:p-10">
          <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-6">Making an Impact across India</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: `${servicesCount}+`, label: 'Live Active Listings' },
              { value: '1,500+', label: 'Sessions Completed' },
              { value: '₹18L+', label: 'Direct Senior Earnings' },
              { value: '100%', label: 'Escrow Protected' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/70 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
