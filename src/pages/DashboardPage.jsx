import { useNavigate } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Star, TrendingUp, Calendar, Bell, Sparkles, ChevronRight, PlusCircle, MessageCircle, DollarSign, Settings } from 'lucide-react';
import { useApp } from '../context';
import { mockUser, mockReviews } from '../data';

export default function DashboardPage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const user = currentUser || mockUser;

  const quickActions = [
    { label: 'My Services', icon: '📚', path: '/services' },
    { label: 'My Products', icon: '🛍️', path: '/products' },
    { label: 'Pricing Assistant', icon: '💡', path: '/pricing-assistant' },
    { label: 'Messages', icon: '💬', path: '/messages' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 safe-bottom">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4 fade-in">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-bg text-white text-2xl font-bold flex items-center justify-center shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-gray-800">Hello, {user.name}</h2>
              <span className="text-[10px] bg-primary-100 text-primary-700 font-bold px-2 py-0.5 rounded-full capitalize">
                {user.type}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Senior Education & Vedic Maths Expert • {user.location}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/add')}
          className="px-5 py-3 gradient-bg text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Create New Listing
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Earnings</span>
          <p className="text-2xl font-extrabold text-primary-700 mt-1">₹12,450</p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +18% this month
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bookings / Orders</span>
          <p className="text-2xl font-extrabold text-gray-800 mt-1">28</p>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">This month</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Rating</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1 flex items-center gap-1">
            4.8 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </p>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">From 32 reviews</span>
        </div>
      </div>

      {/* SilverAI Proactive Suggestion Card */}
      <div className="gradient-bg-soft rounded-3xl p-6 border border-primary-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-bg text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-800 text-sm">SilverAI Opportunity Suggestion</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Based on your tutoring profile, <strong>weekend mathematics classes</strong> have a 40% higher demand in Chennai right now.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/pricing-assistant')}
          className="shrink-0 px-4 py-2.5 bg-white text-primary-700 font-bold rounded-xl text-xs border border-primary-200 shadow-sm hover:bg-primary-50 transition-colors"
        >
          Explore Opportunity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-800 text-base mb-4">Recent Activity</h3>
            
            <div className="space-y-3">
              {[
                { title: 'New Booking Received', sub: 'Maths Tuition (Priya Ramesh)', time: 'Today, 10:30 AM', price: '₹400', status: 'Confirmed' },
                { title: 'Payment Received', sub: '₹800 for 2 hours session', time: 'Today, 09:15 AM', price: '₹800', status: 'Paid' },
                { title: 'New 5-Star Review', sub: '"Excellent teacher, very patient!"', time: 'Yesterday', price: '⭐ 5.0', status: 'Review' },
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">{act.title}</h4>
                    <p className="text-[11px] text-gray-500">{act.sub}</p>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{act.time}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-primary-700 block">{act.price}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                      {act.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-800 text-base mb-4">Quick Management</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => navigate(qa.path)}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left hover:bg-primary-50 transition-colors group"
                >
                  <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{qa.icon}</span>
                  <span className="text-xs font-bold text-gray-800 block">{qa.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
