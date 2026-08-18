import { createContext, useContext, useState } from 'react';
import { mockUser } from './data';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const savedSession = JSON.parse(localStorage.getItem('silverhands_session') || 'null');
  const [currentUser, setCurrentUser] = useState(savedSession?.user || null);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(savedSession));
  const [accessToken, setAccessToken] = useState(savedSession?.accessToken || null);
  const [seniorMode, setSeniorMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currentTab, setCurrentTab] = useState('home');
  const [demoStep, setDemoStep] = useState(0);

  const loginDemo = () => {
    setCurrentUser(mockUser);
    setIsLoggedIn(true);
  };

  const login = (session) => {
    const saved = { user: session.user, accessToken: session.accessToken, refreshToken: session.refreshToken };
    localStorage.setItem('silverhands_session', JSON.stringify(saved));
    setCurrentUser(session.user);
    setAccessToken(session.accessToken);
    setIsLoggedIn(true);
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
        currentUser, isLoggedIn, seniorMode, language, currentTab, demoStep,
        setCurrentUser, setIsLoggedIn, setLanguage, setSeniorMode: handleSeniorMode, accessToken,
        setCurrentTab, setDemoStep, loginDemo, login, logout,
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
