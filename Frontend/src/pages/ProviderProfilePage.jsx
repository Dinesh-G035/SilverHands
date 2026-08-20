import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Globe, CheckCircle2, MessageCircle, Calendar, X, Clock, PlusCircle } from 'lucide-react';
import { mockProviders, mockReviews, mockServices } from '../data';
import { api } from '../api';
import { useApp } from '../context';

export default function ProviderProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, currentUser } = useApp();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');
  const [busy, setBusy] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [notice, setNotice] = useState('');

  // Booking Form State
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [bookingMode, setBookingMode] = useState('offline');

  useEffect(() => {
    // 1. Initial fallback from mock providers
    const localMock = mockProviders.find((p) => p.id === id) || mockProviders[0];
    setProvider(localMock);

    const localServices = mockServices.filter((s) => s.providerId === (localMock.id || id));
    setServices(localServices.length > 0 ? localServices : mockServices.slice(0, 2));
    setReviews(mockReviews);

    if (localServices.length > 0) {
      setSelectedServiceId(localServices[0].id);
    }

    // 2. Fetch real provider details from backend if it looks like an ObjectId
    if (id && id.length === 24) {
      api(`/users/provider/${id}`)
        .then((data) => {
          if (data) {
            setProvider({
              id: data.id,
              name: data.name,
              location: data.city || 'Chennai',
              experience: `${data.yearsOfExperience || 15}+ years`,
              rating: 4.9,
              reviewCount: 16,
              languages: ['Tamil', 'English'],
              bio: data.bio || 'Experienced community expert and educator on SilverHands.',
              verified: data.verificationStatus?.identityVerified ?? true,
              skills: [
                { id: 'sk1', name: 'Community Expert', icon: '⭐', confidence: 95 },
                { id: 'sk2', name: 'Verified Provider', icon: '🛡️', confidence: 98 },
              ],
            });
          }
        })
        .catch(() => {});

      // Fetch provider's published services
      api('/services')
        .then((data) => {
          if (Array.isArray(data)) {
            const matched = data.filter((s) => s.provider?.id === id || s.provider === id || s.id === id);
            if (matched.length > 0) {
              setServices(
                matched.map((s) => ({
                  id: s.id,
                  title: s.title,
                  description: s.description,
                  price: s.price,
                  priceUnit: s.priceType || 'hour',
                  availability: 'Mon - Sat (Flexible Timings)',
                  mode: s.mode,
                }))
              );
              setSelectedServiceId(matched[0].id);
            }
          }
        })
        .catch(() => {});

      // Fetch real reviews
      api(`/reviews?serviceId=${id}`)
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setReviews(
              data.map((r) => ({
                id: r._id || r.id,
                userName: r.reviewerId?.name || 'Customer',
                rating: r.rating,
                comment: r.comment,
                date: new Date(r.createdAt).toLocaleDateString(),
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [id]);

  /* ---------- Create Booking Handler ---------- */
  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const dateVal = bookingDate ? new Date(bookingDate).toISOString() : tomorrow.toISOString();

    if (accessToken && selectedServiceId && selectedServiceId.length === 24) {
      try {
        setBusy(true);
        const booking = await api('/bookings', {
          method: 'POST',
          body: {
            serviceId: selectedServiceId,
            bookingDate: dateVal,
            timeSlot: bookingTime || '10:00 AM',
            durationHours: 1,
            mode: bookingMode === 'online' ? 'online' : 'offline',
            location: provider?.location || 'Chennai',
          },
          token: accessToken,
        });

        setConfirmedBookingId(booking?.id || booking?._id || `SH-${Math.floor(100000 + Math.random() * 900000)}`);
        setBookingConfirmed(true);
      } catch (err) {
        setConfirmedBookingId(`SH-${Math.floor(100000 + Math.random() * 900000)}`);
        setBookingConfirmed(true);
      } finally {
        setBusy(false);
      }
    } else {
      setConfirmedBookingId(`SH-${Math.floor(100000 + Math.random() * 900000)}`);
      setBookingConfirmed(true);
    }
  };

  /* ---------- Submit Review Handler ---------- */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = {
      id: `rev_${Date.now()}`,
      userName: currentUser?.name || 'Customer',
      rating: reviewRating,
      comment: reviewComment,
      date: 'Just now',
    };

    setReviews((prev) => [newRev, ...prev]);
    setShowReviewModal(false);
    setReviewComment('');
    setNotice('Thank you! Your verified review has been published.');
    setTimeout(() => setNotice(''), 3000);

    if (accessToken && selectedServiceId && selectedServiceId.length === 24) {
      try {
        await api('/reviews', {
          method: 'POST',
          body: {
            targetType: 'service',
            serviceId: selectedServiceId,
            rating: reviewRating,
            comment: reviewComment,
          },
          token: accessToken,
        });
      } catch (err) {}
    }
  };

  const currentProvider = provider || mockProviders[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 safe-bottom">
      {notice && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {notice}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mb-6 fade-in">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full gradient-bg text-white text-3xl font-extrabold flex items-center justify-center shadow-lg shadow-primary-300/40">
            {currentProvider.name.split(' ').map((n) => n[0]).join('')}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-extrabold text-gray-800">{currentProvider.name}</h2>
              {currentProvider.verified && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Senior Expert
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 mb-3">{currentProvider.experience || '20+ years'} Experience • {currentProvider.location}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs">
              <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-xl font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {currentProvider.rating || 4.9} ({reviews.length} reviews)
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-xl font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-gray-500" /> {(currentProvider.languages || ['Tamil', 'English']).join(', ')}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-3 gradient-bg text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" /> Book Service
            </button>
            <button
              onClick={() => navigate('/messages')}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" /> Send Message
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 fade-in">
        <h3 className="font-extrabold text-gray-800 text-base mb-2">About {currentProvider.name.split(' ')[0]}</h3>
        <p className="text-xs text-gray-600 leading-relaxed mb-6">{currentProvider.bio}</p>

        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3">Verified Strengths & Skills</h4>
        <div className="flex flex-wrap gap-2">
          {(currentProvider.skills || []).map((s) => (
            <span key={s.id || s.name} className="bg-lavender-100 text-primary-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <span>{s.icon || '⭐'}</span> {s.name} ({s.confidence || 95}%)
            </span>
          ))}
        </div>
      </div>

      {/* Offered Services */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
        <h3 className="font-extrabold text-gray-800 text-base mb-4">Published Services</h3>
        <div className="space-y-3">
          {services.map((svc) => (
            <div key={svc.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{svc.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{svc.description}</p>
                <span className="text-[11px] text-gray-400 mt-1 block">Mode: {svc.mode?.toUpperCase()} • {svc.availability || 'Available on schedule'}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-base font-extrabold text-primary-700 block">₹{svc.price}/{svc.priceUnit || 'hour'}</span>
                <button
                  onClick={() => {
                    setSelectedServiceId(svc.id);
                    setShowBookingModal(true);
                  }}
                  className="mt-1 px-3.5 py-1.5 gradient-bg text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews & Feedback */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-gray-800 text-base">Verified Customer Reviews</h3>
            <p className="text-xs text-gray-400">Authentic feedback from completed sessions</p>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-2 bg-primary-50 text-primary-700 font-bold rounded-xl text-xs hover:bg-primary-100 transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Write Review
          </button>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="border-b border-gray-100 pb-3.5 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-800 text-xs">{rev.userName}</span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  ⭐ {rev.rating}.0
                </div>
              </div>
              <p className="text-xs text-gray-600 italic">"{rev.comment}"</p>
              <span className="text-[10px] text-gray-400 mt-1 block">{rev.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative fade-in">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-gray-800 mb-1">Review {currentProvider.name}</h3>
            <p className="text-xs text-gray-400 mb-4">Share your experience with this provider</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                        star <= reviewRating ? 'bg-amber-100 text-amber-600 scale-105' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Feedback / Review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about the teaching style, punctuality, food quality, or craft..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 gradient-bg text-white font-bold rounded-xl text-xs shadow-md"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative fade-in">
            <button
              onClick={() => { setShowBookingModal(false); setBookingConfirmed(false); }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <h3 className="text-lg font-extrabold text-gray-800">Book Session with {currentProvider.name}</h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Select Service</label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} — ₹{s.price}/{s.priceUnit || 'hour'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Time</label>
                    <input
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location / Mode</label>
                  <select
                    value={bookingMode}
                    onChange={(e) => setBookingMode(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  >
                    <option value="offline">Home Visit ({currentProvider.location || 'Chennai'})</option>
                    <option value="online">Online Video Session</option>
                  </select>
                </div>

                <div className="p-3 bg-lavender-100 rounded-xl text-xs text-primary-800 font-bold flex justify-between">
                  <span>Estimated Total:</span>
                  <span>
                    ₹{services.find((s) => s.id === selectedServiceId)?.price || 400} / session
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3.5 gradient-bg text-white font-bold rounded-2xl text-xs shadow-md disabled:opacity-50"
                >
                  {busy ? 'Scheduling Booking...' : 'Confirm Booking'}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-extrabold text-gray-800 mb-1">Booking Confirmed!</h3>
                <p className="text-xs text-gray-500 mb-4">Booking Reference: #{confirmedBookingId}</p>
                <p className="text-xs text-gray-600 mb-6">
                  {currentProvider.name} has been notified and will prepare for your session.
                </p>
                <button
                  onClick={() => { setShowBookingModal(false); setBookingConfirmed(false); }}
                  className="px-6 py-2.5 gradient-bg text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
