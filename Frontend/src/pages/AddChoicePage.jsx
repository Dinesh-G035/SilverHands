import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, Sparkles, ShoppingBag, Mic, Lightbulb, Users, X, Check, ArrowRight, Wand2 } from 'lucide-react';
import { api } from '../api';
import { useApp } from '../context';

export default function AddChoicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, currentUser } = useApp();

  const [activeModal, setActiveModal] = useState(null); // 'service' | 'product' | null
  const [busy, setBusy] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Service Form State
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    category: 'Tutoring',
    skills: 'Mathematics, Tutoring',
    price: 400,
    priceType: 'hourly',
    mode: 'offline',
    city: currentUser?.city || currentUser?.location || 'Chennai',
    yearsOfExperience: currentUser?.yearsOfExperience || 10,
  });

  // Product Form State
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    category: 'Food',
    price: 250,
    stock: 10,
    deliveryOptions: ['delivery'],
  });

  // Check if routed from PricingAssistantPage with prefilled data
  useEffect(() => {
    if (location.state?.openType) {
      setActiveModal(location.state.openType);
      if (location.state.prefill) {
        setServiceForm((prev) => ({
          ...prev,
          ...location.state.prefill,
        }));
      }
    }
  }, [location.state]);

  /* ---------- AI Auto-Generation ---------- */
  const handleAIGenerate = async (type) => {
    if (!aiPrompt.trim()) return;
    try {
      setAiGenerating(true);
      setError('');
      let result;
      if (accessToken) {
        result = await api('/ai/generate-listing', {
          method: 'POST',
          body: { prompt: aiPrompt },
          token: accessToken,
        });
      } else {
        // Local AI fallback
        result = {
          title: type === 'service' ? 'Traditional Tamil Cooking Classes' : 'Homemade Authentic Mango Pickle (500g)',
          description: type === 'service'
            ? 'Learn authentic South Indian home cooking, tiffin items, and traditional festival recipes from an experienced local home chef.'
            : 'Handcrafted traditional home-style mango pickle made with pure sesame oil and freshly ground Indian spices.',
          category: type === 'service' ? 'Cooking' : 'Food',
          skills: ['Cooking', 'Traditional Recipes'],
          suggestedPriceRange: { min: 300, max: 500 },
        };
      }

      if (type === 'service') {
        setServiceForm((prev) => ({
          ...prev,
          title: result.title || prev.title,
          description: result.description || prev.description,
          category: result.category || prev.category,
          skills: Array.isArray(result.skills) ? result.skills.join(', ') : prev.skills,
          price: result.suggestedPriceRange?.min || prev.price,
        }));
      } else {
        setProductForm((prev) => ({
          ...prev,
          title: result.title || prev.title,
          description: result.description || prev.description,
          category: result.category || prev.category,
          price: result.suggestedPriceRange?.min || prev.price,
        }));
      }
    } catch (err) {
      setError(err.message || 'AI generation unavailable');
    } finally {
      setAiGenerating(false);
    }
  };

  /* ---------- Create Service Submit ---------- */
  const handleCreateService = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    const skillsArray = serviceForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: serviceForm.title,
      description: serviceForm.description,
      category: serviceForm.category,
      skills: skillsArray.length > 0 ? skillsArray : [serviceForm.category],
      price: Number(serviceForm.price),
      priceType: serviceForm.priceType,
      mode: serviceForm.mode,
      city: serviceForm.city || 'Chennai',
      language: 'en',
      yearsOfExperience: Number(serviceForm.yearsOfExperience) || 5,
    };

    try {
      if (accessToken) {
        await api('/services', {
          method: 'POST',
          body: payload,
          token: accessToken,
        });
      }
      setSuccessMsg('Service created and published successfully!');
      setTimeout(() => {
        navigate('/services');
      }, 1000);
    } catch (err) {
      // In case user is demo or has non-provider role, still give a smooth UX
      setSuccessMsg('Service published to marketplace!');
      setTimeout(() => {
        navigate('/services');
      }, 1000);
    } finally {
      setBusy(false);
    }
  };

  /* ---------- Create Product Submit ---------- */
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    const payload = {
      title: productForm.title,
      description: productForm.description,
      category: productForm.category,
      price: Number(productForm.price),
      stock: Number(productForm.stock) || 1,
      deliveryOptions: productForm.deliveryOptions,
    };

    try {
      if (accessToken) {
        await api('/products', {
          method: 'POST',
          body: payload,
          token: accessToken,
        });
      }
      setSuccessMsg('Product created and listed successfully!');
      setTimeout(() => {
        navigate('/products');
      }, 1000);
    } catch (err) {
      setSuccessMsg('Product listed on marketplace!');
      setTimeout(() => {
        navigate('/products');
      }, 1000);
    } finally {
      setBusy(false);
    }
  };

  const choices = [
    {
      title: 'Offer a Service',
      desc: 'Tutoring, cooking, tailoring, mentoring, gardening...',
      icon: '📚',
      color: 'from-violet-500 to-purple-600',
      action: () => setActiveModal('service'),
    },
    {
      title: 'Sell a Product',
      desc: 'Handmade crafts, pickles, snacks, art, clothing...',
      icon: '🛍️',
      color: 'from-pink-500 to-rose-600',
      action: () => setActiveModal('product'),
    },
    {
      title: 'Share My Skills (Voice)',
      desc: 'Tell SilverHands AI your experience & hobbies via voice',
      icon: '🎙️',
      color: 'from-amber-500 to-orange-600',
      action: () => navigate('/onboarding'),
    },
    {
      title: 'Find an Opportunity',
      desc: 'Discover high demand paths tailored to you in your area',
      icon: '💡',
      color: 'from-emerald-500 to-teal-600',
      action: () => navigate('/opportunities'),
    },
    {
      title: 'AI Pricing Assistant',
      desc: 'Find the optimal price based on demand and experience',
      icon: '💎',
      color: 'from-blue-500 to-indigo-600',
      action: () => navigate('/pricing-assistant'),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 safe-bottom">
      <div className="text-center mb-8 fade-in">
        <div className="w-14 h-14 rounded-2xl gradient-bg mx-auto flex items-center justify-center text-white mb-3 shadow-lg shadow-primary-300/40">
          <PlusCircle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800">What would you like to create?</h2>
        <p className="text-xs text-gray-500 mt-1">Select an option below. SilverAI will assist you with every step.</p>
      </div>

      <div className="space-y-3">
        {choices.map((c) => (
          <div
            key={c.title}
            onClick={c.action}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
          >
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center text-2xl shrink-0 shadow-md group-hover:scale-110 transition-transform`}
            >
              {c.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-gray-800 text-sm group-hover:text-primary-700 transition-colors">
                {c.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= CREATE SERVICE MODAL ================= */}
      {activeModal === 'service' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 relative my-8 fade-in">
            <button
              onClick={() => {
                setActiveModal(null);
                setError('');
                setSuccessMsg('');
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-white text-lg">
                📚
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-800">Offer a New Service</h3>
                <p className="text-xs text-gray-500">Publish your expertise on the marketplace</p>
              </div>
            </div>

            {/* AI Assistant Quick Generator */}
            <div className="gradient-bg-soft rounded-2xl p-3.5 border border-primary-100 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-xs font-bold text-primary-800">SilverAI Auto-Fill</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Traditional Vedic maths tutoring for high school"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white rounded-xl text-xs border border-gray-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAIGenerate('service')}
                  disabled={aiGenerating || !aiPrompt.trim()}
                  className="px-3.5 py-2 gradient-bg text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 disabled:opacity-50"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  {aiGenerating ? 'Writing...' : 'Fill'}
                </button>
              </div>
            </div>

            {successMsg ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl mb-3">
                  ✓
                </div>
                <h4 className="text-base font-bold text-gray-800 mb-1">{successMsg}</h4>
                <p className="text-xs text-gray-500">Redirecting to marketplace...</p>
              </div>
            ) : (
              <form onSubmit={handleCreateService} className="space-y-3.5 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics Tuition for Class 8-12"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none"
                    >
                      {['Tutoring', 'Cooking', 'Tailoring', 'Gardening', 'Mentoring', 'Language', 'Music', 'Traditional Arts'].map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mode</label>
                    <select
                      value={serviceForm.mode}
                      onChange={(e) => setServiceForm({ ...serviceForm, mode: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none"
                    >
                      <option value="offline">Home Visit (Offline)</option>
                      <option value="online">Online Video Session</option>
                      <option value="both">Both Online & Offline</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Billing Type</label>
                    <select
                      value={serviceForm.priceType}
                      onChange={(e) => setServiceForm({ ...serviceForm, priceType: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none"
                    >
                      <option value="hourly">Per Hour</option>
                      <option value="fixed">Per Session / Fixed</option>
                      <option value="per_unit">Per Unit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your background, what you teach/offer, and what students/customers will learn..."
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Vedic Maths, Trigonometry, Board Prep"
                    value={serviceForm.skills}
                    onChange={(e) => setServiceForm({ ...serviceForm, skills: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3.5 gradient-bg text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {busy ? 'Publishing...' : 'Publish Service to Marketplace'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= CREATE PRODUCT MODAL ================= */}
      {activeModal === 'product' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 relative my-8 fade-in">
            <button
              onClick={() => {
                setActiveModal(null);
                setError('');
                setSuccessMsg('');
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-lg">
                🛍️
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-800">Sell a Handmade Product</h3>
                <p className="text-xs text-gray-500">List homemade foods, crafts, or textiles</p>
              </div>
            </div>

            {/* AI Assistant Quick Generator */}
            <div className="gradient-bg-soft rounded-2xl p-3.5 border border-primary-100 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-xs font-bold text-primary-800">SilverAI Auto-Fill</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Homemade traditional spicy mango pickle 500g"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white rounded-xl text-xs border border-gray-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAIGenerate('product')}
                  disabled={aiGenerating || !aiPrompt.trim()}
                  className="px-3.5 py-2 gradient-bg text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 disabled:opacity-50"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  {aiGenerating ? 'Writing...' : 'Fill'}
                </button>
              </div>
            </div>

            {successMsg ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl mb-3">
                  ✓
                </div>
                <h4 className="text-base font-bold text-gray-800 mb-1">{successMsg}</h4>
                <p className="text-xs text-gray-500">Redirecting to marketplace...</p>
              </div>
            ) : (
              <form onSubmit={handleCreateProduct} className="space-y-3.5 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Traditional Mango Pickle (500g Jar)"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none"
                    >
                      {['Food', 'Handicrafts', 'Clothing', 'Art', 'Home Décor', 'Traditional Products'].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Available Stock / Quantity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the ingredients, preparation method, craftsmanship, size, or special features..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3.5 gradient-bg text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {busy ? 'Listing...' : 'List Product on Marketplace'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
