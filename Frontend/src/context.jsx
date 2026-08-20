import { createContext, useContext, useState } from 'react';
import { api } from './api';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const savedSession = JSON.parse(localStorage.getItem('silverhands_session') || 'null');
  const [currentUser, setCurrentUser] = useState(savedSession?.user || null);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(savedSession?.user));
  const [accessToken, setAccessToken] = useState(savedSession?.accessToken || null);
  const [seniorMode, setSeniorMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currentTab, setCurrentTab] = useState('home');
  const [demoStep, setDemoStep] = useState(0);

  const isAdmin = currentUser?.role === 'admin';
  const userRole = isAdmin ? 'admin' : 'user';

  const login = (session) => {
    const user = session.user || session;
    const token = session.accessToken || session.token || 'real_jwt_session';
    const refreshToken = session.refreshToken || '';

    const saved = { user, accessToken: token, refreshToken };
    localStorage.setItem('silverhands_session', JSON.stringify(saved));
    setCurrentUser(user);
    setAccessToken(token);
    setIsLoggedIn(true);
  };

  const loginDemo = async (role = 'user') => {
    const mobile = role === 'admin' ? '9999988888' : '9876543210';
    try {
      // 1. Request OTP via real API
      await api('/auth/send-otp', { method: 'POST', body: { mobile } }).catch(() => {});

      // 2. Verify OTP via real API to retrieve real MongoDB user & authentic JWT token
      const session = await api('/auth/verify-otp', {
        method: 'POST',
        body: {
          mobile,
          otp: '123456',
          role: role === 'admin' ? 'admin' : 'provider',
          name: role === 'admin' ? 'Rajesh Kumar (Admin)' : 'Lakshmi Ammal',
        },
      });

      login(session);
      return session;
    } catch (err) {
      // Fallback in case of server offline
      const fallbackUser = {
        id: role === 'admin' ? 'adm1' : 'u1',
        name: role === 'admin' ? 'Rajesh Kumar (Admin)' : 'Lakshmi Ammal',
        role: role === 'admin' ? 'admin' : 'provider',
        mobile,
        city: 'Chennai',
        verificationStatus: { mobileVerified: true, identityVerified: true, experienceVerified: true },
      };
      login({ user: fallbackUser, accessToken: 'token_' + Date.now() });
      return { user: fallbackUser };
    }
  };

  const switchRole = async (newRole) => {
    return loginDemo(newRole);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setDemoStep(0);
    setAccessToken(null);
    localStorage.removeItem('silverhands_session');
  };

  const handleSeniorMode = (v) => {
    setSeniorMode(v);
    if (v) {
      document.body.classList.add('senior-mode');
    } else {
      document.body.classList.remove('senior-mode');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        isAdmin,
        userRole,
        seniorMode,
        language,
        currentTab,
        demoStep,
        accessToken,
        setCurrentUser,
        setIsLoggedIn,
        setLanguage,
        setSeniorMode: handleSeniorMode,
        setCurrentTab,
        setDemoStep,
        loginDemo,
        switchRole,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
