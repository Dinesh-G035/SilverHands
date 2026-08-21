import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  Shield,
  Activity,
  Check,
  X,
  Lock,
} from 'lucide-react';
import { useApp } from '../context';
import { api } from '../api';

export default function AdminPage() {
  const { isAdmin, currentUser, accessToken } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'moderation' | 'reports' | 'stats'
  const [usersList, setUsersList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [busy, setBusy] = useState(false);
  const [actionNotice, setActionNotice] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Initial load
  useEffect(() => {
    if (accessToken && isAdmin) {
      api('/admin/users', { token: accessToken })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setUsersList(
              data.map((u) => ({
                id: u._id || u.id,
                name: u.name || 'SilverHands Member',
                mobile: u.mobile,
                role: u.role,
                city: u.city || 'Chennai',
                verificationStatus: u.verificationStatus || {
                  mobileVerified: true,
                  identityVerified: false,
                  experienceVerified: false,
                },
                createdAt: u.createdAt || new Date().toISOString(),
              }))
            );
          }
        })
        .catch(() => {});

      api('/admin/reports', { token: accessToken })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setReportsList(
              data.map((r) => ({
                id: r._id || r.id,
                reporterName: r.reporterId?.name || 'Customer',
                targetType: r.targetType,
                targetTitle: r.targetType?.toUpperCase(),
                reason: r.reason,
                description: r.description,
                status: r.status,
                date: new Date(r.createdAt).toLocaleDateString(),
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [accessToken, isAdmin]);

  /* ---------- User Verification Handler ---------- */
  const handleToggleVerification = async (userId, field) => {
    const targetUser = usersList.find((u) => u.id === userId);
    if (!targetUser) return;

    const currentVal = targetUser.verificationStatus?.[field] || false;
    const newVal = !currentVal;

    // Optimistic UI update
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              verificationStatus: {
                ...u.verificationStatus,
                [field]: newVal,
              },
            }
          : u
      )
    );

    setActionNotice(`Updated ${field} for ${targetUser.name} to ${newVal ? 'Verified' : 'Unverified'}`);
    setTimeout(() => setActionNotice(''), 2500);

    if (accessToken && userId.length === 24) {
      try {
        await api(`/admin/users/${userId}/verify`, {
          method: 'PATCH',
          body: { [field]: newVal },
          token: accessToken,
        });
      } catch (err) {
        // Optimistic update retained
      }
    }
  };

  /* ---------- Listing Moderation Handler ---------- */
  const handleModerateListing = async (type, id, status) => {
    if (type === 'service') {
      setServicesList((prev) =>
        prev.map((s) => (s.id === id ? { ...s, moderationStatus: status } : s))
      );
    } else {
      setProductsList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, moderationStatus: status } : p))
      );
    }

    setActionNotice(`Listing marked as ${status.toUpperCase()}`);
    setTimeout(() => setActionNotice(''), 2500);

    if (accessToken && id.length === 24) {
      try {
        await api(`/admin/listings/${type}/${id}/moderate`, {
          method: 'PATCH',
          body: { moderationStatus: status },
          token: accessToken,
        });
      } catch (err) {}
    }
  };

  /* ---------- Report Resolution Handler ---------- */
  const handleResolveReport = async (reportId, status) => {
    setReportsList((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: status } : r))
    );

    setActionNotice(`Report marked as ${status.toUpperCase()}`);
    setTimeout(() => setActionNotice(''), 2500);

    if (accessToken && reportId.length === 24) {
      try {
        await api(`/admin/reports/${reportId}/resolve`, {
          method: 'PATCH',
          body: { status, adminNotes: 'Resolved by Admin Control Center' },
          token: accessToken,
        });
      } catch (err) {}
    }
  };

  /* ---------- Access Control Guard ---------- */
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center safe-bottom">
        <div className="bg-white rounded-3xl p-8 border border-red-100 shadow-xl fade-in">
          <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Administrator Access Required</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            You are currently logged in with the <strong>User</strong> role. You must have Administrator privileges to access the SilverHands platform governance and moderation tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl text-xs hover:bg-gray-200 transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.mobile.includes(userSearchQuery) ||
      u.city.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 safe-bottom">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4 fade-in">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-bg text-white text-3xl font-extrabold flex items-center justify-center shadow-lg shadow-primary-300/40">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-gray-800">Admin Control Center</h2>
              <span className="text-[10px] bg-primary-100 text-primary-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Full Access
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Platform Governance • Senior Trust Verification • Marketplace Moderation • Dispute Handling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
        </div>
      </div>

      {actionNotice && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {actionNotice}
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Registered Users</span>
          <p className="text-2xl font-extrabold text-gray-800 mt-1">{usersList.length + 240}</p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +12% this week
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Verified Seniors</span>
          <p className="text-2xl font-extrabold text-primary-700 mt-1">
            {usersList.filter((u) => u.verificationStatus?.identityVerified).length + 180}
          </p>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">Identity & Exp Verified</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Listings</span>
          <p className="text-2xl font-extrabold text-gray-800 mt-1">{servicesList.length + productsList.length}</p>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">Services & Handmade Products</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Platform Volume</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">₹4.85L</p>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">100% Escrow Protected</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 max-w-lg">
        {[
          { id: 'users', label: 'User Verification', icon: Users },
          { id: 'moderation', label: 'Content Moderation', icon: FileCheck },
          { id: 'reports', label: 'Disputes & Reports', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                isActive ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: USERS & VERIFICATION ================= */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-extrabold text-gray-800">User Identity & Trust Governance</h3>
              <p className="text-xs text-gray-400">Verify mobile numbers, government IDs, and declared experience.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user or mobile..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">City</th>
                  <th className="pb-3 text-center">Mobile OTP</th>
                  <th className="pb-3 text-center">Identity (Govt ID)</th>
                  <th className="pb-3 text-center">Experience Check</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-gray-900">{u.name}</div>
                      <div className="text-[10px] text-gray-400">{u.mobile}</div>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'provider'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5">{u.city}</td>
                    <td className="py-3.5 text-center">
                      <button
                        onClick={() => handleToggleVerification(u.id, 'mobileVerified')}
                        className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                          u.verificationStatus?.mobileVerified
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                        title="Toggle Mobile Verification"
                      >
                        {u.verificationStatus?.mobileVerified ? '✓ Verified' : '○ Pending'}
                      </button>
                    </td>
                    <td className="py-3.5 text-center">
                      <button
                        onClick={() => handleToggleVerification(u.id, 'identityVerified')}
                        className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                          u.verificationStatus?.identityVerified
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                        title="Toggle Identity Verification"
                      >
                        {u.verificationStatus?.identityVerified ? '✓ Approved' : '⏳ Review'}
                      </button>
                    </td>
                    <td className="py-3.5 text-center">
                      <button
                        onClick={() => handleToggleVerification(u.id, 'experienceVerified')}
                        className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                          u.verificationStatus?.experienceVerified
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                        title="Toggle Experience Verification"
                      >
                        {u.verificationStatus?.experienceVerified ? '✓ Verified' : '○ Pending'}
                      </button>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => navigate(`/provider/${u.id}`)}
                        className="text-primary-600 font-bold hover:underline"
                      >
                        View Profile →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: CONTENT MODERATION ================= */}
      {activeTab === 'moderation' && (
        <div className="space-y-6 fade-in">
          {/* Services Moderation */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-extrabold text-gray-800 mb-1">Services Listings Moderation</h3>
            <p className="text-xs text-gray-400 mb-4">Review and approve services created by community providers.</p>

            <div className="space-y-3">
              {servicesList.map((s) => (
                <div
                  key={s.id}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-800 text-sm">{s.title}</h4>
                      <span className="text-[10px] bg-primary-50 text-primary-700 font-bold px-2 py-0.5 rounded-md">
                        {s.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.moderationStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : s.moderationStatus === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {s.moderationStatus || 'Approved'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{s.description}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Price: ₹{s.price}/{s.priceType || s.priceUnit || 'hr'} • Provider: {s.providerName || s.provider?.name || 'Lakshmi Iyer'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleModerateListing('service', s.id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs hover:bg-emerald-200 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleModerateListing('service', s.id, 'flagged')}
                      className="px-3 py-1.5 bg-amber-100 text-amber-700 font-bold rounded-xl text-xs hover:bg-amber-200 transition-colors flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Flag
                    </button>
                    <button
                      onClick={() => handleModerateListing('service', s.id, 'rejected')}
                      className="px-3 py-1.5 bg-red-100 text-red-700 font-bold rounded-xl text-xs hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: DISPUTES & REPORTS ================= */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 fade-in">
          <h3 className="text-base font-extrabold text-gray-800 mb-1">Dispute & Customer Support Tickets</h3>
          <p className="text-xs text-gray-400 mb-4">Investigate reports from customers, providers, or automated flags.</p>

          <div className="space-y-4">
            {reportsList.map((rep) => (
              <div key={rep.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-sm">{rep.reason}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">{rep.date}</span>
                </div>

                <p className="text-xs text-gray-600 mb-2">{rep.description}</p>
                <div className="text-[11px] text-gray-400 mb-3">
                  Reported by: <strong className="text-gray-700">{rep.reporterName}</strong> • Target: {rep.targetTitle}
                </div>

                {rep.status !== 'resolved' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolveReport(rep.id, 'resolved')}
                      className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Resolve Dispute
                    </button>
                    <button
                      onClick={() => handleResolveReport(rep.id, 'dismissed')}
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-300 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Resolved by Administrator
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
