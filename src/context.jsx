import { createContext, useContext, useState } from 'react';
import { mockUser } from './data';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [seniorMode, setSeniorMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currentTab, setCurrentTab] = useState('home');
  const [demoStep, setDemoStep] = useState(0);

  const loginDemo = () => {
    setCurrentUser(mockUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setDemoStep(0);
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
        setCurrentUser, setIsLoggedIn, setLanguage, setSeniorMode: handleSeniorMode,
        setCurrentTab, setDemoStep, loginDemo, logout,
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
