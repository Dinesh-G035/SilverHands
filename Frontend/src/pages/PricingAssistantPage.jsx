import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, IndianRupee, HelpCircle, Check, Info } from 'lucide-react';
import { api } from '../api';
import { useApp } from '../context';

const servicesList = [
  { label: 'Maths Tuition — 1 hour', category: 'Tutoring', exp: 30, city: 'Chennai' },
  { label: 'Traditional Cooking Class — Session', category: 'Cooking', exp: 20, city: 'Chennai' },
  { label: 'Blouse Stitching — Piece', category: 'Tailoring', exp: 23, city: 'Coimbatore' },
  { label: 'Kitchen Garden Setup — Visit', category: 'Gardening', exp: 15, city: 'Kochi' },
];

export default function PricingAssistantPage() {
  const [selectedService, setSelectedService] = useState(servicesList[0].label);
  const [price, setPrice] = useState(400);
  const [priceRange, setPriceRange] = useState({ min: 300, max: 500 });
  const [explanation, setExplanation] = useState(
    'Based on 30+ years experience, high local market demand, and Chennai benchmark rates.'
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [busy, setBusy] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { currentUser, accessToken } = useApp();
  const navigate = useNavigate();

  const currentObj = servicesList.find((s) => s.label === selectedService) || servicesList[0];

  useEffect(() => {
    fetchPricingRecommendation(currentObj);
  }, [selectedService]);

  const fetchPricingRecommendation = async (serviceObj) => {
    const category = serviceObj.category;
    const yearsOfExperience = currentUser?.yearsOfExperience || serviceObj.exp || 10;
    const city = currentUser?.city || serviceObj.city || 'Chennai';

    if (accessToken) {
      try {
        setBusy(true);
        const data = await api('/ai/suggest-price', {
          method: 'POST',
          body: { category, yearsOfExperience, city },
          token: accessToken,
        });

        if (data?.suggestedMin && data?.suggestedMax) {
          setPriceRange({ min: data.suggestedMin, max: data.suggestedMax });
          setPrice(Math.round((data.suggestedMin + data.suggestedMax) / 2));
          if (data.seniorFriendlyExplanation) {
            setExplanation(data.seniorFriendlyExplanation);
          }
        }
      } catch (err) {
        const baseMin = 250 + Math.min(yearsOfExperience * 10, 250);
        setPriceRange({ min: baseMin, max: baseMin + 200 });
        setPrice(baseMin + 100);
      } finally {
        setBusy(false);
      }
    } else {
      const baseMin = 250 + Math.min(yearsOfExperience * 10, 250);
      setPriceRange({ min: baseMin, max: baseMin + 200 });
      setPrice(baseMin + 100);
    }
  };

  const handleUsePrice = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      // Navigate to /add with the configured prefill data to directly create the listing
      navigate('/add', {
        state: {
          openType: 'service',
          prefill: {
            title: currentObj.label.split(' — ')[0],
            category: currentObj.category,
            price: price,
            priceType: currentObj.label.includes('Session') ? 'fixed' : 'hourly',
          },
        },
      });
    }, 800);
  };

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
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-primary-500"
          >
            {servicesList.map((s) => (
              <option key={s.label} value={s.label}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* AI Recommended Price Box */}
        <div className="gradient-bg-soft rounded-2xl p-6 border border-primary-100 text-center relative overflow-hidden">
          <span className="text-[11px] font-extrabold text-primary-700 uppercase tracking-wider">AI Recommended Price Range</span>
          <h3 className="text-3xl font-extrabold text-gray-800 my-2">
            ₹{priceRange.min} – ₹{priceRange.max} <span className="text-sm font-normal text-gray-500">/ hour</span>
          </h3>
          <p className="text-xs text-gray-500">{explanation}</p>

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
                <li><strong>Your Experience ({currentObj.exp} yrs):</strong> Top experience bracket in {currentObj.city}.</li>
                <li><strong>Location ({currentObj.city}):</strong> Benchmark rate aligned with local neighborhood standards.</li>
                <li><strong>Market Demand:</strong> High localized demand surge reflected in recommended pricing.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Pricing Factors */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Key Pricing Factors</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Your Experience', val: `${currentObj.exp}+ Years`, icon: '🎓' },
              { label: 'Location', val: currentObj.city, icon: '📍' },
              { label: 'Market Demand', val: 'High 🔥', icon: '📈' },
              { label: 'Similar Services', val: `₹${priceRange.min - 50} – ₹${priceRange.max + 100}`, icon: '⚖️' },
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
            min={150}
            max={1000}
            step={25}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-primary-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
            <span>₹150 (Budget)</span>
            <span>₹{Math.round((priceRange.min + priceRange.max) / 2)} (Optimal)</span>
            <span>₹1000 (Premium)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleUsePrice}
            disabled={busy}
            className="flex-1 py-3.5 gradient-bg text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" /> Price Applied! Opening Listing Form...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Use This Price (₹{price}) & Create Listing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
