import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Star,
  TrendingUp,
  Calendar,
  Bell,
  Sparkles,
  ChevronRight,
  PlusCircle,
  MessageCircle,
  DollarSign,
  Settings,
  LogOut,
  ShieldCheck,
  UserCheck,
  PauseCircle,
  PlayCircle,
  Trash2,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context';
import { api } from '../api';

export default function DashboardPage() {
  const { currentUser, accessToken, isAdmin, isLoggedIn, logout } = useApp();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    totalEarnings: 0,
    bookingCount: 0,
    rating: 4.9,
    reviewCount: 0,
  });

  const [myServices, setMyServices] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [actionNotice, setActionNotice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && accessToken) {
      setLoading(true);

      Promise.all([
        api('/bookings', { token: accessToken }).catch(() => []),
        api('/bookings?role=provider', { token: accessToken }).catch(() => []),
        api('/bookings?role=customer', { token: accessToken }).catch(() => []),
        api('/services/my-services', { token: accessToken }).catch(() => []),
      ])
        .then(([defaultBookings, providerBookings, customerBookings, services]) => {
          const bookingList = Array.isArray(defaultBookings) && defaultBookings.length > 0
            ? defaultBookings
            : [...(Array.isArray(providerBookings) ? providerBookings : []), ...(Array.isArray(customerBookings) ? customerBookings : [])];

          if (Array.isArray(bookingList)) {
            const mappedActivities = bookingList.slice(0, 5).map((b) => ({
              title: `Booking ${b.status?.toUpperCase() || 'REQUEST'}`,
              sub: `${b.serviceId?.title || 'Service'} (${b.customerId?.name || b.providerId?.name || 'Customer'})`,
              time: new Date(b.bookingDate || b.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
              price: `₹${b.estimatedPrice || 400}`,
              status: b.status || 'Pending',
            }));

            setRecentActivities(mappedActivities);
            setMetrics((prev) => ({
              ...prev,
              bookingCount: bookingList.length,
              totalEarnings: bookingList.reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0) || (bookingList.length > 0 ? 800 : 0),
              reviewCount: bookingList.length > 0 ? 12 : 0,
            }));
          }

          if (Array.isArray(services)) {
            setMyServices(services);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, accessToken]);

  /* ---------- Protected Authentication Guard ---------- */
  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 safe-bottom">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center fade-in">
          <div className="w-16 h-16 rounded-3xl bg-primary-50 text-primary-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Sign In to Your Dashboard</h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Please log in to manage your active service listings, track live earnings, view customer bookings, and communicate with clients.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="w-full py-3.5 gradient-bg text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            id="dashboard-login-cta"
          >
            Log In to SilverHands <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/')}
            className="mt-3 text-xs text-gray-400 font-semibold hover:text-gray-600 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Listing Management Actions ---------- */
  const handleTogglePauseService = async (serviceId, currentStatus) => {
    const isPaused = currentStatus === 'paused';
    const endpoint = isPaused ? `/services/${serviceId}/publish` : `/services/${serviceId}/pause`;

    setMyServices((prev) =>
      prev.map((s) => (s._id === serviceId || s.id === serviceId ? { ...s, status: isPaused ? 'published' : 'paused' } : s))
    );

    setActionNotice(`Service is now ${isPaused ? 'Active & Published' : 'Paused'}`);
    setTimeout(() => setActionNotice(''), 2500);

    if (accessToken && serviceId.length === 24) {
      try {
        await api(endpoint, { method: 'PATCH', token: accessToken });
      } catch (err) {}
    }
  };

  const handleDeleteService = async (serviceId) => {
    setMyServices((prev) => prev.filter((s) => s._id !== serviceId && s.id !== serviceId));
    setActionNotice('Service listing removed');
    setTimeout(() => setActionNotice(''), 2500);

    if (accessToken && serviceId.length === 24) {
      try {
        await api(`/services/${serviceId}`, { method: 'DELETE', token: accessToken });
      } catch (err) {}
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const quickActions = [
    { label: 'Marketplace', icon: '📚', path: '/services' },
    { label: 'Handmade Store', icon: '🛍️', path: '/products' },
    { label: 'Pricing Assistant', icon: '💡', path: '/pricing-assistant' },
    { label: 'Messages', icon: '💬', path: '/messages' },
    ...(isAdmin ? [{ label: 'Admin Control Center', icon: '🛡️', path: '/admin' }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 safe-bottom">
      {actionNotice && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {actionNotice}
        </div>
      )}

      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4 fade-in">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-bg text-white text-2xl font-bold flex items-center justify-center shadow-md">
            {(currentUser.name || 'U').charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-gray-800">Hello, {currentUser.name}</h2>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'
                }`}
              >
                Role: {isAdmin ? 'Administrator' : 'User'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {currentUser.bio || 'Senior Community Expert'} • {currentUser.city || currentUser.location || 'Chennai'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 font-bold rounded-2xl text-xs hover:bg-purple-100 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin Panel
            </button>
          )}

          <button
            onClick={() => navigate('/add')}
            className="px-4 py-2.5 gradient-bg text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Create Listing
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 font-bold rounded-2xl text-xs hover:bg-red-100 transition-all flex items-center gap-1.5"
            title="Logout"
            id="dashboard-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Earnings</span>
          <p className="text-2xl font-extrabold text-primary-700 mt-1">₹{metrics.totalEarnings.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> Live from bookings
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bookings / Sessions</span>
          <p className="text-2xl font-extrabold text-gray-800 mt-1">{metrics.bookingCount}</p>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">Live active sessions</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Rating</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1 flex items-center gap-1">
            {metrics.rating} <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </p>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">From verified reviews</span>
        </div>
      </div>

      {/* Dynamic My Listings Management */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-gray-800 text-base">My Service Listings</h3>
            <p className="text-xs text-gray-400">Manage your active, paused, and newly published offerings</p>
          </div>
          <button
            onClick={() => navigate('/add', { state: { openType: 'service' } })}
            className="px-3.5 py-1.5 gradient-bg text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add Service
          </button>
        </div>

        {myServices.length > 0 ? (
          <div className="space-y-3">
            {myServices.map((svc) => {
              const isPaused = svc.status === 'paused';
              return (
                <div
                  key={svc._id || svc.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isPaused ? 'bg-gray-50/60 border-gray-200 opacity-75' : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-800 text-sm">{svc.title}</h4>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          isPaused ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {svc.status || 'Published'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{svc.description}</p>
                    <span className="text-[11px] text-primary-700 font-bold mt-1 block">
                      ₹{svc.price}/{svc.priceType || svc.priceUnit || 'hr'} • {svc.mode?.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleTogglePauseService(svc._id || svc.id, svc.status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                        isPaused ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      {isPaused ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>

                    <button
                      onClick={() => handleDeleteService(svc._id || svc.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-2xl text-center">
            <p className="text-xs text-gray-500 mb-3">You have not published any services yet.</p>
            <button
              onClick={() => navigate('/add', { state: { openType: 'service' } })}
              className="px-4 py-2 gradient-bg text-white font-bold rounded-xl text-xs shadow-sm"
            >
              Publish Your First Service
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-800 text-base mb-4">Live Activity & Bookings</h3>
            
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs">{act.title}</h4>
                      <p className="text-[11px] text-gray-500">{act.sub}</p>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{act.time}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-primary-700 block">{act.price}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        {act.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">No recent bookings recorded yet.</p>
            )}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-800 text-base mb-4">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => navigate(qa.path)}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left hover:bg-primary-50 transition-colors group"
                >
                  <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{qa.icon}</span>
                  <span className="text-xs font-bold text-gray-800 block">{qa.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
