import { createContext, useContext, useState } from 'react';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const savedSession = JSON.parse(localStorage.getItem('silverhands_session') || 'null');
  const [currentUser, setCurrentUser] = useState(savedSession?.user || null);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(savedSession?.user));
  const [accessToken, setAccessToken] = useState(savedSession?.accessToken || null);
  const [seniorMode, setSeniorMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currentTab, setCurrentTab] = useState('home');

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

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
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
        accessToken,
        setCurrentUser,
        setIsLoggedIn,
        setLanguage,
        setSeniorMode: handleSeniorMode,
        setCurrentTab,
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
