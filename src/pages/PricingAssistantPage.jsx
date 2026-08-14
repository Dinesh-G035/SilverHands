import { useState } from 'react';
import { Sparkles, IndianRupee, HelpCircle, Check, Info } from 'lucide-react';

export default function PricingAssistantPage() {
  const [service, setService] = useState('Maths Tuition — 1 hour');
  const [price, setPrice] = useState(400);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 safe-bottom">
      <div className="text-center mb-8 fade-in">
        <div className="w-14 h-14 rounded-2xl gradient-bg mx-auto flex items-center justify-center text-white mb-3 shadow-lg shadow-primary-300/40">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800">AI Pricing Assistant</h2>
        <p className="text-xs text-gray-500 mt-1">Find the optimal price based on demand, experience, and local rates.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl fade-in space-y-6">
        
        {/* Service selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Which service do you want to price?</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Maths Tuition — 1 hour">Maths Tuition — 1 hour</option>
            <option value="Traditional Cooking Class — Session">Traditional Cooking Class — Session</option>
            <option value="Blouse Stitching — Piece">Blouse Stitching — Piece</option>
            <option value="Kitchen Garden Setup — Visit">Kitchen Garden Setup — Visit</option>
          </select>
        </div>

        {/* AI Recommended Price Box */}
        <div className="gradient-bg-soft rounded-2xl p-6 border border-primary-100 text-center relative overflow-hidden">
          <span className="text-[11px] font-extrabold text-primary-700 uppercase tracking-wider">AI Recommended Price Range</span>
          <h3 className="text-3xl font-extrabold text-gray-800 my-2">₹300 – ₹500 <span className="text-sm font-normal text-gray-500">/ hour</span></h3>
          <p className="text-xs text-gray-500">Based on 30+ years experience, high local market demand, and Chennai benchmark rates.</p>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="mt-3 text-xs text-primary-700 font-bold flex items-center justify-center gap-1 mx-auto hover:underline"
          >
            <HelpCircle className="w-4 h-4" /> Why is this the recommended price?
          </button>

          {showExplanation && (
            <div className="mt-4 p-4 bg-white rounded-xl text-left text-xs space-y-2 border border-primary-100 fade-in shadow-sm">
              <p className="font-bold text-gray-800 flex items-center gap-1">
                <Info className="w-4 h-4 text-primary-600" /> SilverAI Breakdown:
              </p>
              <ul className="space-y-1 text-gray-600 list-disc pl-4">
                <li><strong>Your Experience (30 yrs):</strong> Top 5% experience bracket in Chennai (+₹100/hr premium).</li>
                <li><strong>Location (Chennai):</strong> Average maths tutoring rate is ₹350/hr.</li>
                <li><strong>Market Demand:</strong> High demand for board exam tutors (+15% surge).</li>
              </ul>
            </div>
          )}
        </div>

        {/* Pricing Factors */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Key Pricing Factors</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Your Experience', val: '30+ Years', icon: '🎓' },
              { label: 'Location', val: 'Chennai', icon: '📍' },
              { label: 'Market Demand', val: 'High 🔥', icon: '📈' },
              { label: 'Similar Services', val: '₹250 – ₹600', icon: '⚖️' },
            ].map((f) => (
              <div key={f.label} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-lg block">{f.icon}</span>
                <span className="text-[10px] text-gray-400 font-bold block mt-1">{f.label}</span>
                <span className="text-xs font-bold text-gray-800">{f.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-gray-700">Set Your Final Price:</label>
            <span className="text-lg font-extrabold text-primary-700">₹{price} / hr</span>
          </div>
          <input
            type="range"
            min={200}
            max={800}
            step={50}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-primary-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
            <span>₹200 (Budget)</span>
            <span>₹400 (Optimal)</span>
            <span>₹800 (Premium)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => alert(`Saved price ₹${price}/hr for ${service}`)}
            className="flex-1 py-3.5 gradient-bg text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Use This Price (₹{price})
          </button>
        </div>
      </div>
    </div>
  );
}
