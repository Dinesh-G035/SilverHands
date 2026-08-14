import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Globe, CheckCircle2, MessageCircle, Calendar, X, Clock } from 'lucide-react';
import { mockProviders, mockReviews, mockServices } from '../data';

export default function ProviderProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const provider = mockProviders.find((p) => p.id === id) || mockProviders[0];
  const services = mockServices.filter((s) => s.providerId === provider.id);

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 safe-bottom">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mb-6 fade-in">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full gradient-bg text-white text-3xl font-extrabold flex items-center justify-center shadow-lg shadow-primary-300/40">
            {provider.name.split(' ').map(n => n[0]).join('')}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-extrabold text-gray-800">{provider.name}</h2>
              {provider.verified && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Expert
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 mb-3">{provider.experience} Experience • {provider.location}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs">
              <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-xl font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {provider.rating} ({provider.reviewCount} reviews)
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-xl font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-gray-500" /> {provider.languages.join(', ')}
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
        <h3 className="font-extrabold text-gray-800 text-base mb-2">About {provider.name.split(' ')[0]}</h3>
        <p className="text-xs text-gray-600 leading-relaxed mb-6">{provider.bio}</p>

        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3">Verified Skills</h4>
        <div className="flex flex-wrap gap-2">
          {provider.skills.map((s) => (
            <span key={s.id} className="bg-lavender-100 text-primary-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <span>{s.icon}</span> {s.name} ({s.confidence}%)
            </span>
          ))}
        </div>
      </div>

      {/* Trust & Verification Badges */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 mb-6 fade-in">
        <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-3">SilverHands Trust Verification</h4>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold text-emerald-900">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Identity Verified
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mobile Verified
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Experience Checked
          </span>
        </div>
      </div>

      {/* Offered Services */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
        <h3 className="font-extrabold text-gray-800 text-base mb-4">Offered Services</h3>
        <div className="space-y-3">
          {services.map((svc) => (
            <div key={svc.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{svc.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{svc.description}</p>
                <span className="text-[11px] text-gray-400 mt-1 block">Availability: {svc.availability}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-primary-700 block">₹{svc.price}/{svc.priceUnit}</span>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="mt-1 px-3 py-1 gradient-bg text-white font-bold rounded-lg text-[11px] shadow-sm"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-extrabold text-gray-800 text-base mb-4">Customer Reviews</h3>
        <div className="space-y-4">
          {mockReviews.map((rev) => (
            <div key={rev.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
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
                <h3 className="text-lg font-extrabold text-gray-800">Book Service with {provider.name}</h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Select Service</label>
                  <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold">
                    {services.map(s => <option key={s.id}>{s.title} — ₹{s.price}/{s.priceUnit}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Date</label>
                    <input type="date" required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Time</label>
                    <input type="time" required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location / Mode</label>
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium">
                    <option>Home Visit (Chennai)</option>
                    <option>Online Session via Video Call</option>
                  </select>
                </div>

                <div className="p-3 bg-lavender-100 rounded-xl text-xs text-primary-800 font-bold flex justify-between">
                  <span>Estimated Total:</span>
                  <span>₹400 / hour</span>
                </div>

                <button type="submit" className="w-full py-3.5 gradient-bg text-white font-bold rounded-2xl text-xs shadow-md">
                  Confirm Booking
                </button>
              </form>
            ) : (
              <div className="text-center py-6 fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-extrabold text-gray-800 mb-1">Booking Confirmed!</h3>
                <p className="text-xs text-gray-500 mb-4">Booking ID: #SH-{Math.floor(100000 + Math.random() * 900000)}</p>
                <p className="text-xs text-gray-600 mb-6">
                  {provider.name} will confirm your schedule shortly. Details sent to your mobile.
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
