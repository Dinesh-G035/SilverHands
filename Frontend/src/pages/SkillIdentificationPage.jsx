import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, Award, ArrowRight, Edit, Plus } from 'lucide-react';
import { useApp } from '../context';

export default function SkillIdentificationPage() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([
    { name: 'Traditional South Indian Cooking', icon: '🍳', confidence: 95, verified: true },
    { name: 'Mathematics & Vedic Maths', icon: '📐', confidence: 92, verified: true },
    { name: 'Food Preservation & Pickling', icon: '🫙', confidence: 88, verified: true },
    { name: 'Student Tutoring', icon: '📚', confidence: 85, verified: false },
  ]);

  const { loginDemo } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirmProfile = () => {
    loginDemo();
    navigate('/opportunities');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 max-w-2xl mx-auto safe-bottom">
      <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 fade-in">
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full gradient-bg mx-auto flex items-center justify-center text-white mb-6 mic-pulse shadow-xl shadow-primary-300/40">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Identifying Your Skills</h2>
            <p className="text-gray-500 text-sm">AI is analyzing what you told us...</p>
            <div className="ai-dots flex justify-center gap-1.5 mt-6">
              <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
              <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
              <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold mb-3">
                <CheckCircle2 className="w-4 h-4" /> AI Analysis Complete
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800">Your Identified Skills</h2>
              <p className="text-xs text-gray-500 mt-1">Based on your voice input, our AI extracted the following strengths.</p>
            </div>

            {/* AI Profile Suggestion Banner */}
            <div className="gradient-bg-soft rounded-2xl p-4 border border-primary-100 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-bg text-white flex items-center justify-center text-xl shrink-0 font-bold shadow-md">
                👑
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider text-primary-600 uppercase">AI Suggested Title</span>
                <h3 className="text-base font-extrabold text-gray-800 leading-snug">Traditional Cooking & Education Expert</h3>
                <p className="text-xs text-gray-500 mt-0.5">Detected Experience: <strong className="text-gray-700">20+ Years</strong></p>
              </div>
            </div>

            {/* Skills List */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Matched Skills & Confidence</h4>
              {skills.map((s, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <h5 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                        {s.name}
                        {s.verified && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </h5>
                      <div className="w-32 bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="gradient-bg h-full rounded-full skill-fill"
                          style={{ width: `${s.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">
                    {s.confidence}% Match
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => alert('Skill edit modal opened!')}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit className="w-4 h-4" /> Edit / Add Skills
              </button>
              <button
                onClick={handleConfirmProfile}
                className="flex-1 py-3.5 gradient-bg text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Confirm & See Opportunities <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
