import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { Phone, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('senior');
  const [language, setLanguageChoice] = useState('Tamil');
  const [location, setLocation] = useState('Chennai');

  const { loginDemo } = useApp();
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) setStep(2);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginDemo();
    navigate('/onboarding');
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    loginDemo();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 safe-bottom">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl gradient-bg mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md shadow-primary-300/40">
            S
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome to SilverHands</h2>
          <p className="text-xs text-gray-500 mt-1">Your skills can change lives and create livelihood.</p>
        </div>

        {/* Tab selector */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
          <button
            onClick={() => { setTab('login'); setStep(1); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              tab === 'login' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab('signup'); setStep(1); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              tab === 'signup' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {tab === 'login' && (
          <div>
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-sm font-medium text-gray-500">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 gradient-bg text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Continue with OTP <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4 fade-in">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Enter OTP sent to +91 {phone || '98765 43210'}</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center tracking-widest text-lg py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <p className="text-right text-[11px] text-primary-600 mt-1 cursor-pointer hover:underline">Resend OTP</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 gradient-bg text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
                >
                  Verify & Enter SilverHands
                </button>
              </form>
            )}
          </div>
        )}

        {/* Signup Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Lakshmi Iyer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">I am joining as a:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'senior', label: 'Senior Citizen', icon: '👴' },
                  { id: 'homemaker', label: 'Homemaker', icon: '👩‍🍳' },
                  { id: 'customer', label: 'Customer', icon: '🛍️' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setUserType(type.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      userType === type.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl block mb-0.5">{type.icon}</span>
                    <span className="text-[11px] block leading-tight">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguageChoice(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  {['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City/Location</label>
                <input
                  type="text"
                  required
                  placeholder="Chennai"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 gradient-bg text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm mt-2"
            >
              Create Account
            </button>
          </form>
        )}

        {/* Demo Fast Login */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <button
            onClick={() => { loginDemo(); navigate('/onboarding'); }}
            className="w-full py-2.5 bg-primary-50 text-primary-700 font-bold rounded-xl text-xs hover:bg-primary-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" /> Quick Hackathon Demo Login (as Lakshmi Iyer)
          </button>
          <p className="text-[10px] text-gray-400 mt-3">
            By continuing, you agree to SilverHands Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
