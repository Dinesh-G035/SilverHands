import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { Phone, ArrowRight, ShieldCheck, UserCheck, Shield, Lock, Sparkles, Check } from 'lucide-react';
import { api } from '../api';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('user'); // 'user' | 'admin'
  const [userType, setUserType] = useState('senior');
  const [language, setLanguageChoice] = useState('Tamil');
  const [location, setLocation] = useState('Chennai');

  const { loginDemo, login } = useApp();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [successInfo, setSuccessInfo] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setError('');
    if (role === 'admin') {
      setTab('login'); // Admin is login-only
      setStep(1);
      setPhone('9999988888');
    } else {
      setPhone('9876543210');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setError('');
      const cleanMobile = phone.replace(/\D/g, '').slice(-10);
      const res = await api('/auth/send-otp', { method: 'POST', body: { mobile: cleanMobile } });
      if (tab === 'signup') setTab('login');
      setStep(2);
      if (res?.mockOtp) {
        setOtp(res.mockOtp);
        setSuccessInfo(`Default OTP for demo: ${res.mockOtp}`);
      } else {
        setOtp('');
        setSuccessInfo('OTP sent to your phone number.');
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setError('');
      const cleanMobile = phone.replace(/\D/g, '').slice(-10);
      const session = await api('/auth/verify-otp', {
        method: 'POST',
        body: {
          mobile: cleanMobile,
          otp,
          name: name || undefined,
          role: selectedRole === 'admin' ? 'admin' : userType === 'customer' ? 'customer' : 'provider',
        },
      });
      login(session);
      if (selectedRole === 'admin' || session.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleQuickRealLogin = async (role) => {
    try {
      setBusy(true);
      setError('');
      const session = await loginDemo(role);
      if (role === 'admin' || session?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const handleSignupSubmit = handleSendOtp;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 safe-bottom">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl gradient-bg mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md shadow-primary-300/40">
            S
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome to SilverHands</h2>
          <p className="text-xs text-gray-500 mt-1">Live Role-Based Authentication with Real Database</p>
        </div>

        {/* Role Selector Pill */}
        <div className="mb-5 bg-lavender-100/70 p-1.5 rounded-2xl flex items-center gap-1 border border-primary-100">
          <button
            type="button"
            onClick={() => handleRoleChange('user')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'user'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            User Account
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Administrator
          </button>
        </div>

        {/* User Mode: Tab selector (Login vs Signup) */}
        {selectedRole === 'user' ? (
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
            <button
              onClick={() => {
                setTab('login');
                setStep(1);
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                tab === 'login' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setTab('signup');
                setStep(1);
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                tab === 'signup' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="mb-6 p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-purple-900 text-xs">Administrator Authentication</h3>
              <p className="text-[11px] text-purple-700">Restricted to authorized personnel. Login only.</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' && (
          <div>
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      {selectedRole === 'admin' ? 'Admin Mobile Number' : 'Mobile Number'}
                    </label>
                    <span className="text-[10px] text-primary-600 font-bold">
                      {selectedRole === 'admin' ? 'Test: 99999 88888' : 'Test: 98765 43210'}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-sm font-medium text-gray-500">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder={selectedRole === 'admin' ? '99999 88888' : '98765 43210'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className={`w-full py-3.5 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 ${
                    selectedRole === 'admin' ? 'bg-purple-600 hover:bg-purple-700' : 'gradient-bg'
                  }`}
                >
                  {busy ? 'Sending OTP to database…' : <>Continue with OTP <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4 fade-in">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Enter OTP sent to +91 {phone || '98765 43210'}
                    </label>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      {otp ? 'Demo OTP ready' : 'OTP sent to phone'}
                    </span>
                  </div>

                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center tracking-widest text-lg py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <p
                    onClick={handleSendOtp}
                    className="text-right text-[11px] text-primary-600 mt-1 cursor-pointer hover:underline"
                  >
                    Resend OTP
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className={`w-full py-3.5 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50 ${
                    selectedRole === 'admin' ? 'bg-purple-600 hover:bg-purple-700' : 'gradient-bg'
                  }`}
                >
                  {busy ? 'Authenticating with MongoDB…' : `Verify & Enter as ${selectedRole === 'admin' ? 'Administrator' : 'User'}`}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Signup Form */}
        {selectedRole === 'user' && tab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Lakshmi Ammal"
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">I am joining as:</label>
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
                    <option key={l} value={l}>
                      {l}
                    </option>
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
              disabled={busy}
              className="w-full py-3.5 gradient-bg text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm mt-2 disabled:opacity-50"
            >
              {busy ? 'Creating User in Database…' : 'Create Account'}
            </button>
          </form>
        )}

        {/* 1-Click Real API Authentications */}
        <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center mb-2">
            1-Click Real API Database Logins
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickRealLogin('user')}
              disabled={busy}
              className="py-2.5 px-2 bg-primary-50 text-primary-700 font-bold rounded-xl text-xs hover:bg-primary-100 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <UserCheck className="w-3.5 h-3.5" /> Login as User
            </button>

            <button
              type="button"
              onClick={() => handleQuickRealLogin('admin')}
              disabled={busy}
              className="py-2.5 px-2 bg-purple-50 text-purple-700 font-bold rounded-xl text-xs hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5 border border-purple-200 disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Login as Admin
            </button>
          </div>

          <p className="text-[10px] text-gray-400 mt-3 text-center">
            Connects to live MongoDB cluster with real JWT session tokens.
          </p>
        </div>

        {error && <p className="mt-3 text-center text-sm text-red-600 font-medium">{error}</p>}
      </div>
    </div>
  );
}
