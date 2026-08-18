import { useEffect, useState } from 'react';
import { Search, ShoppingBag, Star, Plus } from 'lucide-react';
import { api } from '../api';
import { useApp } from '../context';

const categories = ['All', 'Food', 'Handicrafts', 'Clothing', 'Art', 'Home Décor', 'Traditional Products'];

export default function ProductsMarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const { accessToken } = useApp();

  useEffect(() => {
    const params = new URLSearchParams({ limit: '50' });
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    api(`/products?${params}`).then(setProducts).catch((requestError) => setError(requestError.message));
  }, [selectedCategory]);

  const filteredProducts = products.filter(p => 
    selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 safe-bottom">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">Handmade & Local Products</h2>
          <p className="text-xs text-gray-500">Authentic homemade pickles, crafts, embroidery and textiles crafted by seniors & homemakers.</p>
        </div>

        {/* Cart button */}
        <button className="relative p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'gradient-bg text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((prod) => (
          <div key={prod.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              {/* Image Placeholder */}
              <div className="w-full h-36 rounded-2xl gradient-bg-soft flex items-center justify-center text-4xl mb-3 border border-primary-100 relative">
                {prod.category === 'Food' ? '🫙' : prod.category === 'Clothing' ? '🧣' : '🎨'}
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[10px] font-extrabold px-2 py-0.5 rounded-full text-gray-700 shadow-sm">
                  {prod.category}
                </span>
              </div>

              <span className="text-[11px] text-gray-400 font-medium block">By {prod.seller?.name || 'SilverHands Seller'}</span>
              <h3 className="font-bold text-gray-800 text-sm mb-1 leading-snug line-clamp-1">{prod.title}</h3>
              <p className="text-[11px] text-gray-500 line-clamp-2 mb-3">{prod.description}</p>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-gray-800">₹{prod.price}</span>
                <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" /> {prod.rating}
                </div>
              </div>

              <button
                onClick={async () => {
                  try { await api('/cart', { method: 'POST', body: { productId: prod.id, quantity: 1 }, token: accessToken }); setCartCount((count) => count + 1); }
                  catch (requestError) { setError(requestError.message); }
                }}
                className="p-2.5 gradient-bg text-white rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform"
                title="Add to Cart"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="mt-6 text-center text-sm text-red-600">{error}</p>}
      {!error && products.length === 0 && <p className="mt-6 text-center text-sm text-gray-500">No published products found yet.</p>}
    </div>
  );
}
