import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Search, Sparkles, MapPin, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AISearchPage() {
  const [query, setQuery] = useState('I need a Tamil tutor near me for my 10 year old daughter.');
  const [isListening, setIsListening] = useState(false);
  const [searched, setSearched] = useState(true);

  const navigate = useNavigate();

  const results = [
    {
      id: 'svc4',
      name: 'Sangeetha Mani',
      title: 'Tamil Language Expert & Tutoring',
      exp: '18 years exp',
      rating: 4.9,
      distance: 2.1,
      price: 350,
      mode: 'Online & Home Visit',
      matchReason: 'Matches language (Tamil), age group focus (kids & teens), and proximity (2.1 km).',
    },
    {
      id: 'svc1',
      name: 'Lakshmi Iyer',
      title: 'Tamil & Maths Educator',
      exp: '30 years exp',
      rating: 4.8,
      distance: 2.8,
      price: 400,
      mode: 'Home Visit',
      matchReason: 'High experience (30 yrs), home visit tutor, fluent in Tamil.',
    },
  ];

  const handleSearch = () => {
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 safe-bottom">
      <div className="text-center mb-8 fade-in">
        <div className="w-14 h-14 rounded-2xl gradient-bg mx-auto flex items-center justify-center text-white mb-3 shadow-lg shadow-primary-300/40">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800">Ask SilverAI Search</h2>
        <p className="text-xs text-gray-500 mt-1">Speak or type naturally. AI matches skills, distance, and budget.</p>
      </div>

      {/* Large Input Bar */}
      <div className="bg-white rounded-3xl p-3 shadow-xl border border-gray-100 mb-8 fade-in">
        <div className="flex items-center gap-3 px-3 py-2">
          <button
            onClick={() => setIsListening(!isListening)}
            className={`p-3 rounded-2xl transition-all ${
              isListening ? 'bg-red-500 text-white mic-pulse' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <textarea
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tell us what you're looking for..."
            className="w-full bg-transparent outline-none text-sm font-medium text-gray-800 resize-none pt-1"
          />
          <button
            onClick={handleSearch}
            className="p-3.5 gradient-bg text-white rounded-2xl shadow-md hover:scale-105 transition-transform"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Voice Suggestions */}
        <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1 border-t border-gray-50">
          <span className="text-[10px] font-bold text-gray-400 self-center">Try asking:</span>
          {[
            'Traditional Tamil cook for festival food',
            'Maths tuition near Chennai',
            'Tailor for saree blouse stitching',
          ].map((sample) => (
            <button
              key={sample}
              onClick={() => { setQuery(sample); setSearched(true); }}
              className="text-[11px] bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700 px-3 py-1 rounded-full font-medium transition-colors"
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>

      {/* AI Interpretation & Results */}
      {searched && (
        <div className="space-y-4 fade-in">
          <div className="gradient-bg-soft rounded-2xl p-4 border border-primary-100 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary-600 shrink-0" />
            <p className="text-xs text-primary-900 font-semibold">
              <strong>SilverAI interpreted:</strong> Category: <em>Tutoring</em> | Language: <em>Tamil</em> | Student: <em>10 years old</em> | Proximity: <em>&lt; 5 km</em>
            </p>
          </div>

          <h3 className="text-base font-extrabold text-gray-800 pt-2">SilverAI Recommendations</h3>

          {results.map((res) => (
            <div key={res.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-bg text-white font-bold flex items-center justify-center">
                    {res.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-sm">{res.name}</h4>
                    <p className="text-xs text-primary-600 font-bold">{res.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-gray-800">{res.rating}</span>
                </div>
              </div>

              {/* Match Reason Banner */}
              <div className="bg-emerald-50 rounded-xl p-2.5 text-emerald-800 text-xs font-medium mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Why recommended:</strong> {res.matchReason}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500 font-medium">
                  <span className="font-bold text-gray-800">₹{res.price}/hr</span> • {res.distance} km away
                </div>

                <button
                  onClick={() => navigate(`/provider/${res.id}`)}
                  className="px-4 py-2 gradient-bg text-white font-bold rounded-xl text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-1"
                >
                  View & Book <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
