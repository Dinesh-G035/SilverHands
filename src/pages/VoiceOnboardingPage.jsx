import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, RefreshCw, ArrowRight, Volume2, Globe } from 'lucide-react';
import { useApp } from '../context';

export default function VoiceOnboardingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [selectedLang, setSelectedLang] = useState('Tamil');

  const { language, setLanguage } = useApp();
  const navigate = useNavigate();

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecorded(false);
    setTimeout(() => {
      setIsRecording(false);
      setRecorded(true);
    }, 4000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecorded(true);
  };

  const handleReset = () => {
    setIsRecording(false);
    setRecorded(false);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto safe-bottom">
      <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 text-center fade-in">
        
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold mb-4">
          <Globe className="w-3.5 h-3.5" /> Voice-First Profile Setup
        </span>

        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">
          Let's Get To Know You
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
          You can speak in your preferred language. We'll automatically identify your skills and create your profile for you.
        </p>

        {/* Language Selector */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-gray-500 mb-2">Select Language You Speak</label>
          <div className="flex flex-wrap justify-center gap-2">
            {['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'].map((lang) => (
              <button
                key={lang}
                onClick={() => { setSelectedLang(lang); setLanguage(lang); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedLang === lang
                    ? 'gradient-bg text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Mic Circle & Pulse */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative">
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-primary-400 opacity-30 mic-pulse scale-150"></div>
            )}
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform active:scale-95 ${
                isRecording
                  ? 'bg-red-500 shadow-red-300'
                  : 'gradient-bg shadow-primary-400/40 hover:scale-105'
              }`}
            >
              {isRecording ? (
                <Square className="w-10 h-10" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </button>
          </div>

          {/* Prompt text */}
          <p className="text-sm font-semibold text-gray-700 mt-6 max-w-sm">
            {isRecording
              ? 'Listening to your story... speak naturally'
              : recorded
              ? 'Voice recording captured successfully!'
              : 'Tap the microphone and tell us about your skills and experience.'}
          </p>

          {/* Waveform when recording */}
          {isRecording && (
            <div className="flex items-center gap-1.5 h-10 mt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <span
                  key={i}
                  className="w-1.5 bg-primary-500 rounded-full waveform-bar"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></span>
              ))}
            </div>
          )}

          {/* Example prompt */}
          {!isRecording && !recorded && (
            <div className="mt-6 p-4 bg-lavender-100 rounded-2xl text-left max-w-md border border-primary-100">
              <div className="flex items-center gap-2 text-primary-700 font-bold text-xs mb-1">
                <Volume2 className="w-4 h-4" /> Example prompt:
              </div>
              <p className="text-xs text-gray-600 italic">
                "I have been cooking traditional Tamil food for 20 years. I also teach women how to make homemade snacks and Vedic maths to children."
              </p>
            </div>
          )}

          {/* Recorded transcript preview */}
          {recorded && (
            <div className="mt-4 p-4 bg-emerald-50 rounded-2xl text-left max-w-md border border-emerald-200 fade-in">
              <span className="text-[11px] font-bold text-emerald-700 block mb-1">Captured Audio Transcript:</span>
              <p className="text-xs text-gray-700 font-medium">
                "I have been cooking traditional Tamil food for 20 years and teaching maths to school children in Chennai..."
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          {recorded && (
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> Record Again
            </button>
          )}

          <button
            onClick={() => navigate('/skill-id')}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              recorded
                ? 'gradient-bg shadow-primary-300'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Analyze Skills with AI <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-gray-400 mt-6">
          ✨ You don't need to type! Our AI handles transcription and skill identification.
        </p>
      </div>
    </div>
  );
}
