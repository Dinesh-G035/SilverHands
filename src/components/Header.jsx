import { Bell, Globe, Accessibility, Menu, X, Home, Search, ShoppingBag, LayoutDashboard, MessageCircle, User, LogOut, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context';

const languages = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];

const sidebarLinks = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Services', icon: Search, path: '/services' },
  { label: 'Products', icon: ShoppingBag, path: '/products' },
  { label: 'Add New', icon: PlusCircle, path: '/add' },
  { label: 'Messages', icon: MessageCircle, path: '/messages' },
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Profile', icon: User, path: '/provider/u1' },
];

export default function Header() {
  const { language, setLanguage, seniorMode, setSeniorMode, isLoggedIn, logout, currentUser } = useApp();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm" id="main-header">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-primary-300/30">
              <span className="text-white text-lg font-bold">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Silver<span className="text-primary-600">Hands</span></h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">Skills. Experience. Opportunities.</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {sidebarLinks.slice(0, 5).map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <button key={link.path} onClick={() => navigate(link.path)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                  <Icon className="w-4 h-4" />{link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500" title="Change Language" id="lang-toggle">
                <Globe className="w-5 h-5" />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-44 z-50 fade-in">
                  {languages.map((lang) => (
                    <button key={lang} onClick={() => { setLanguage(lang); setShowLangMenu(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${language === lang ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setSeniorMode(!seniorMode)} className={`p-2 rounded-xl transition-colors ${seniorMode ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100 text-gray-500'}`} title={seniorMode ? 'Senior Mode ON' : 'Senior Mode OFF'} id="senior-mode-toggle">
              <Accessibility className="w-5 h-5" />
            </button>

            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500" title="Notifications" id="notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {isLoggedIn ? (
              <button onClick={() => navigate('/dashboard')} className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold shadow-md" id="user-avatar">
                {currentUser?.name?.charAt(0) || 'U'}
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-xl gradient-bg text-white text-sm font-semibold shadow-md shadow-primary-300/30 hover:shadow-lg transition-all" id="login-btn">
                Login
              </button>
            )}

            <button onClick={() => setShowSidebar(true)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 lg:hidden" id="menu-toggle">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {showLangMenu && <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />}

      {showSidebar && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setShowSidebar(false)} />
          <div className="fixed top-0 right-0 w-72 h-full bg-white z-50 shadow-2xl lg:hidden fade-in">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Menu</h2>
              <button onClick={() => setShowSidebar(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <nav className="p-4 space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <button key={link.path} onClick={() => { navigate(link.path); setShowSidebar(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Icon className="w-5 h-5" />{link.label}
                  </button>
                );
              })}
              {isLoggedIn && (
                <button onClick={() => { logout(); setShowSidebar(false); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                  <LogOut className="w-5 h-5" />Logout
                </button>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
