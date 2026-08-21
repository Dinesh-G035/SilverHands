import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, ArrowRight, IndianRupee, PlusCircle } from 'lucide-react';
import { api } from '../api';
import { useApp } from '../context';

export default function OpportunityRecommendationsPage() {
  const { accessToken, currentUser } = useApp();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (accessToken) {
      setBusy(true);
      api('/opportunities', { token: accessToken })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((opp, idx) => ({
              id: opp._id || opp.id || `opp_${idx}`,
              title: opp.title,
              description: opp.description,
              demand:
                opp.demandLevel === 'trending'
                  ? 'Trending'
                  : opp.demandLevel === 'high'
                  ? 'High'
                  : opp.demand || 'Medium',
              earningRange: opp.estimatedEarningsRange
                ? `₹${opp.estimatedEarningsRange.min?.toLocaleString()} – ₹${opp.estimatedEarningsRange.max?.toLocaleString()}/${opp.estimatedEarningsRange.unit || 'month'}`
                : opp.earningRange || '₹8,000 – ₹25,000/month',
              category: opp.category,
              icon: opp.icon || '🍱',
            }));
            setOpportunities(mapped);
          }
        })
        .catch(() => setOpportunities([]))
        .finally(() => setBusy(false));
    }
  }, [accessToken]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 safe-bottom">
      <div className="text-center mb-8 fade-in">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold mb-3">
          <Sparkles className="w-4 h-4" /> AI Recommendations
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
          Tailored Opportunities For You
        </h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Based on your skills and experience, here is how you can earn in {currentUser?.city || currentUser?.location || 'Chennai'}.
        </p>
      </div>

      {/* Opportunity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between fade-in"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-2 bg-lavender-100 rounded-2xl">{opp.icon}</span>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 ${
                    opp.demand === 'High' || opp.demand === 'Trending'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> {opp.demand} Demand
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-gray-800 mb-1.5">{opp.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{opp.description}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-2">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Est. Earning Potential</span>
                <span className="text-sm font-extrabold text-primary-700">{opp.earningRange}</span>
              </div>

              <button
                onClick={() => navigate('/add')}
                className="px-4 py-2.5 gradient-bg text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Create This
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
