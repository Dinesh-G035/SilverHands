import {
  Bell,
  Globe,
  Accessibility,
  Menu,
  X,
  Home,
  Search,
  ShoppingBag,
  LayoutDashboard,
  MessageCircle,
  User,
  LogOut,
  PlusCircle,
  Check,
  Sparkles,
  Calendar,
  DollarSign,
  Star,
  Shield,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context';

const languages = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];

const initialNotifications = [
  {
    id: 'n1',
    title: 'New Booking Request',
    desc: 'Priya Ramesh requested Maths Tuition for Sat, 10 AM',
    time: '10 mins ago',
    unread: true,
    type: 'booking',
    path: '/messages',
  },
  {
    id: 'n2',
    title: 'Payment Received',
    desc: '₹800 transferred to your account from Karthik Venkat',
    time: '2 hours ago',
    unread: true,
    type: 'payment',
    path: '/dashboard',
  },
  {
    id: 'n3',
    title: 'New 5-Star Review',
    desc: 'Deepa left a review: "Excellent teacher, very patient!"',
    time: 'Yesterday',
    unread: true,
    type: 'review',
    path: '/provider/u1',
  },
  {
    id: 'n4',
    title: 'SilverAI Opportunity Alert',
    desc: 'High demand for weekend maths tutoring in your area!',
    time: '2 days ago',
    unread: false,
    type: 'ai',
    path: '/pricing-assistant',
  },
];

export default function Header() {
  const {
    language,
    setLanguage,
    seniorMode,
    setSeniorMode,
    isLoggedIn,
    logout,
    currentUser,
    isAdmin,
    userRole,
    switchRole,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n)));
    setShowNotifications(false);
    navigate(notif.path);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowSidebar(false);
    navigate('/');
  };

  const handleToggleRole = () => {
    const nextRole = isAdmin ? 'user' : 'admin';
    switchRole(nextRole);
    setShowUserMenu(false);
  };

  const sidebarLinks = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Services', icon: Search, path: '/services' },
    { label: 'Products', icon: ShoppingBag, path: '/products' },
    { label: 'Add New', icon: PlusCircle, path: '/add' },
    { label: 'Messages', icon: MessageCircle, path: '/messages' },
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    ...(isAdmin ? [{ label: 'Admin Control', icon: ShieldCheck, path: '/admin' }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm" id="main-header">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-primary-300/30">
              <span className="text-white text-lg font-bold">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                Silver<span className="text-primary-600">Hands</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">Skills. Experience. Opportunities.</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-bold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowNotifications(false);
                  setShowUserMenu(false);
                }}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
                title="Change Language"
                id="lang-toggle"
              >
                <Globe className="w-5 h-5" />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-44 z-50 fade-in">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        language === lang
                          ? 'bg-primary-50 text-primary-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Senior Mode Toggle */}
            <button
              onClick={() => setSeniorMode(!seniorMode)}
              className={`p-2 rounded-xl transition-colors ${
                seniorMode ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100 text-gray-500'
              }`}
              title={seniorMode ? 'Senior Mode ON' : 'Senior Mode OFF'}
              id="senior-mode-toggle"
            >
              <Accessibility className="w-5 h-5" />
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowLangMenu(false);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
                title="Notifications"
                id="notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 z-50 fade-in">
                  <div className="px-4 pb-2.5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-gray-800 text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-primary-100 text-primary-700 font-bold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-primary-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                          n.unread ? 'bg-primary-50/40 hover:bg-primary-50/80' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white ${
                            n.type === 'booking'
                              ? 'bg-primary-500'
                              : n.type === 'payment'
                              ? 'bg-emerald-500'
                              : n.type === 'review'
                              ? 'bg-amber-500'
                              : 'gradient-bg'
                          }`}
                        >
                          {n.type === 'booking' && <Calendar className="w-4 h-4" />}
                          {n.type === 'payment' && <span className="font-bold text-xs">₹</span>}
                          {n.type === 'review' && <Star className="w-4 h-4 fill-white" />}
                          {n.type === 'ai' && <Sparkles className="w-4 h-4" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-xs font-bold ${n.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {n.title}
                            </h4>
                            <span className="text-[9px] text-gray-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{n.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 border-t border-gray-100 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/dashboard');
                      }}
                      className="text-xs text-primary-700 font-bold hover:underline"
                    >
                      View All Activity in Dashboard →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile / Account Dropdown & Logout */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                    setShowLangMenu(false);
                  }}
                  className="flex items-center gap-1.5 p-1 pl-1.5 pr-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all shadow-sm"
                  id="user-avatar-btn"
                >
                  <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white text-xs font-extrabold shadow-sm">
                    {(currentUser?.name || 'U').charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-bold text-gray-800 block leading-tight truncate max-w-[100px]">
                      {currentUser?.name?.split(' ')[0] || 'User'}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider block ${
                        isAdmin ? 'text-purple-700 bg-purple-100' : 'text-emerald-700 bg-emerald-100'
                      }`}
                    >
                      {isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-3 z-50 fade-in text-left">
                    {/* User Summary Header */}
                    <div className="p-3 bg-lavender-50 rounded-2xl mb-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-bg text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                        {(currentUser?.name || 'U').charAt(0)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-extrabold text-gray-800 text-xs truncate">
                          {currentUser?.name || 'Lakshmi Iyer'}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                              isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            Role: {isAdmin ? 'Admin' : 'User'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Navigation Options */}
                    <div className="space-y-1 text-xs font-semibold">
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/admin');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-purple-700 font-bold transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          Admin Control Center
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/dashboard');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-500" />
                        My Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/messages');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-gray-500" />
                        Messages
                      </button>

                      {/* Quick Role Switcher */}
                      <button
                        onClick={handleToggleRole}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-primary-50 text-primary-700 transition-colors border border-dashed border-primary-200 mt-1"
                        title="Toggle role for testing"
                      >
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5" />
                          Switch to {isAdmin ? 'User' : 'Admin'}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">Toggle</span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                        id="desktop-logout-btn"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout of SilverHands
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-xl gradient-bg text-white text-sm font-semibold shadow-md shadow-primary-300/30 hover:shadow-lg transition-all"
                id="login-btn"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 lg:hidden"
              id="menu-toggle"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {(showLangMenu || showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowLangMenu(false);
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}

      {showSidebar && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setShowSidebar(false)} />
          <div className="fixed top-0 right-0 w-72 h-full bg-white z-50 shadow-2xl lg:hidden fade-in flex flex-col justify-between">
            <div>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-800">Menu</h2>
                <button onClick={() => setShowSidebar(false)} className="p-2 rounded-xl hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {isLoggedIn && (
                <div className="p-4 bg-lavender-50 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-gray-800 block">{currentUser?.name || 'User'}</span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      Role: {isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleToggleRole}
                    className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-lg font-bold text-primary-700"
                  >
                    Switch Role
                  </button>
                </div>
              )}

              <nav className="p-4 space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <button
                      key={link.path}
                      onClick={() => {
                        navigate(link.path);
                        setShowSidebar(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {isLoggedIn && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all"
                  id="mobile-logout-btn"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
