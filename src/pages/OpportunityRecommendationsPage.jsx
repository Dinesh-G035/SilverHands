import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, ArrowRight, IndianRupee, PlusCircle } from 'lucide-react';
import { mockOpportunities } from '../data';

export default function OpportunityRecommendationsPage() {
  const navigate = useNavigate();

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
          Based on your traditional cooking & tutoring expertise, here is how you can earn in Chennai.
        </p>
      </div>

      {/* Opportunity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockOpportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between fade-in"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-2 bg-lavender-100 rounded-2xl">{opp.icon}</span>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 ${
                    opp.demand === 'High'
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
