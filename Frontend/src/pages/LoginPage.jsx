import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { Mail, ArrowRight, UserCheck, Shield, Lock } from 'lucide-react';
import { api } from '../api';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminOtp, setAdminOtp] = useState('');
  const [adminOtpSent, setAdminOtpSent] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [userType, setUserType] = useState('senior');
  const [language, setLanguageChoice] = useState('Tamil');
  const [location, setLocation] = useState('Chennai');

  const { login } = useApp();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setError('');
    if (role === 'admin') {
      setTab('login');
      setStep(1);
      setAdminPassword('');
      setAdminOtp('');
      setAdminOtpSent(false);
    } else {
      setEmail('');
      setOtp('');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setError('');
      await api('/auth/send-otp', {
        method: 'POST',
        body: { email: email.trim(), purpose: tab === 'signup' ? 'signup' : 'login' },
      });
      if (tab === 'signup') setTab('login');
      setStep(2);
      setOtp('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleAdminOtp = async () => {
    try {
      setBusy(true);
      setError('');
      await api('/auth/send-otp', { method: 'POST', body: { email: email.trim(), purpose: 'login' } });
      setAdminOtpSent(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setError('');
      const session = await api('/auth/admin-login', {
        method: 'POST',
        body: { email: email.trim(), password: adminPassword, otp: adminOtp || undefined },
      });
      login(session);
      navigate('/admin');
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
      const session = await api('/auth/verify-otp', {
        method: 'POST',
        body: {
          email: email.trim(),
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

        {/* Administrator Login Form */}
        {tab === 'login' && selectedRole === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">Email OTP (optional)</label>
                <button type="button" onClick={handleAdminOtp} disabled={busy} className="text-[11px] text-purple-700 font-bold hover:underline disabled:opacity-50">
                  {adminOtpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP for additional verification"
                value={adminOtp}
                onChange={(e) => setAdminOtp(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <button type="submit" disabled={busy} className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50">
              {busy ? 'Signing in…' : 'Sign in as Administrator'}
            </button>
          </form>
        )}

        {/* User Login Form */}
        {tab === 'login' && selectedRole === 'user' && (
          <div>
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      {selectedRole === 'admin' ? 'Admin Email Address' : 'Email Address'}
                    </label>
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
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
                  {busy ? 'Sending email OTP…' : <>Continue with OTP <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4 fade-in">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Enter OTP sent to {email || 'your email address'}
                    </label>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      OTP sent to email
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

        {error && <p className="mt-3 text-center text-sm text-red-600 font-medium">{error}</p>}
      </div>
    </div>
  );
}
