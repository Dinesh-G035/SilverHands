import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, MapPin, Star, Filter, CheckCircle2, ChevronRight, PlusCircle } from 'lucide-react';
import { api } from '../api';
import { mockServices } from '../data';

const categories = ['All', 'Tutoring', 'Cooking', 'Tailoring', 'Gardening', 'Mentoring', 'Language', 'Music', 'Traditional Arts'];

export default function ServicesMarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState(mockServices);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams({ limit: '50' });
    if (selectedCategory !== 'All') params.set('category', selectedCategory);

    api(`/services?${params}`)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const backendMapped = data.map((s) => ({
            id: s.id || s._id,
            providerId: s.providerId || s.provider?.id || s.provider?._id,
            providerName: s.providerName || s.provider?.name || 'SilverHands Provider',
            title: s.title,
            category: s.category,
            description: s.description,
            yearsOfExperience: s.yearsOfExperience || s.experience || 10,
            rating: s.rating || 4.9,
            reviewCount: s.reviewCount || 12,
            price: s.price,
            priceType: s.priceType || s.priceUnit || 'hour',
            approximateDistanceKm: s.approximateDistanceKm || s.distance || 2.5,
            city: s.city || s.location || 'Chennai',
            mode: s.mode || 'offline',
            verified: s.provider?.verificationStatus?.identityVerified ?? true,
          }));

          setServices(backendMapped);
        } else {
          setServices([]);
        }
      })
      .catch(() => {
        setServices([]);
      });
  }, [selectedCategory]);

  const filteredServices = services.filter((s) => {
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
    const providerName = s.providerName || s.provider?.name || '';
    const matchQuery =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 safe-bottom">
      {/* Header & Search */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Find Trusted Local Services</h2>
            <p className="text-xs text-gray-500">Connect with experienced seniors and homemakers offering specialized expertise.</p>
          </div>

          <button
            onClick={() => navigate('/add', { state: { openType: 'service' } })}
            className="px-4 py-2.5 gradient-bg text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Offer a Service
          </button>
        </div>
        
        <div className="mt-4 flex gap-2">
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 px-4 py-2.5 flex items-center gap-2 shadow-sm">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tutor, cook, tailor, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium text-gray-700"
            />
          </div>
          <button
            onClick={() => navigate('/ai-search')}
            className="p-3 gradient-bg text-white rounded-2xl shadow-md hover:scale-105 transition-transform"
            title="Ask SilverAI Natural Language Search"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'gradient-bg text-white shadow-md shadow-primary-200'
                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Provider Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full gradient-bg text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {(svc.providerName || svc.provider?.name || 'Provider').split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1">
                      {svc.providerName || svc.provider?.name || 'SilverHands Provider'}
                      {svc.verified && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </h4>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {typeof svc.yearsOfExperience === 'number' ? `${svc.yearsOfExperience} years exp` : svc.yearsOfExperience}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-gray-800">{svc.rating}</span>
                  <span className="text-[10px] text-gray-400">({svc.reviewCount})</span>
                </div>
              </div>

              {/* Service Title */}
              <h3 className="font-extrabold text-gray-800 text-base mb-1.5">{svc.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{svc.description}</p>

              {/* Badges */}
              <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-4">
                <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  {typeof svc.approximateDistanceKm === 'number'
                    ? `${svc.approximateDistanceKm.toFixed(1)} km`
                    : 'Local'}{' '}
                  ({svc.city})
                </span>
                <span className="bg-primary-50 text-primary-700 font-semibold px-2.5 py-1 rounded-lg capitalize">
                  {svc.mode}
                </span>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-lg font-extrabold text-gray-800">₹{svc.price}</span>
                <span className="text-[11px] text-gray-400 font-medium">/{svc.priceType}</span>
              </div>

              <button
                onClick={() => navigate(`/provider/${svc.providerId || svc.provider?.id || svc.id}`)}
                className="px-4 py-2 bg-primary-50 text-primary-700 font-bold rounded-xl text-xs hover:bg-primary-100 transition-colors flex items-center gap-1"
              >
                View Profile <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="mt-6 text-center text-sm text-red-600">{error}</p>}
      {!error && filteredServices.length === 0 && (
        <p className="mt-6 text-center text-sm text-gray-500">No matching services found in this category.</p>
      )}
    </div>
  );
}
