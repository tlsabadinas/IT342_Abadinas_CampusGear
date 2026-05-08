import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATEGORIES = ['All', 'Electronics', 'Lab Equipment', 'Photography', 'Sports', 'Musical', 'Books'];

const SAMPLE_ITEMS = [
  { id: 1, name: 'Scientific Calculator', dailyRate: 5.00, listerName: 'Sarah M.', category: 'Electronics', imageUrl: '', condition: 'Good', location: 'Engineering Building' },
  { id: 2, name: 'DSLR Camera Kit', dailyRate: 25.00, listerName: 'James R.', category: 'Photography', imageUrl: '', condition: 'Excellent', location: 'Engineering Building, Room 204' },
  { id: 3, name: 'Acoustic Guitar', dailyRate: 10.00, listerName: 'Maria L.', category: 'Musical', imageUrl: '', condition: 'Good', location: 'Music Building' },
  { id: 4, name: 'Lab Microscope', dailyRate: 15.00, listerName: 'David K.', category: 'Lab Equipment', imageUrl: '', condition: 'Excellent', location: 'Science Building' },
  { id: 5, name: 'Arduino Starter Kit', dailyRate: 8.00, listerName: 'Alex T.', category: 'Electronics', imageUrl: '', condition: 'Good', location: 'Tech Hub' },
  { id: 6, name: 'Tripod Stand', dailyRate: 5.00, listerName: 'Nina C.', category: 'Photography', imageUrl: '', condition: 'Good', location: 'Media Center' },
  { id: 7, name: 'Basketball', dailyRate: 3.00, listerName: 'Rico S.', category: 'Sports', imageUrl: '', condition: 'Good', location: 'Gym' },
  { id: 8, name: 'Physics Textbook', dailyRate: 2.00, listerName: 'Leah P.', category: 'Books', imageUrl: '', condition: 'Fair', location: 'Library' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll();
      if (response.data.success && response.data.data.length > 0) {
        setItems(response.data.data);
        setFilteredItems(response.data.data);
      } else {
        // Use sample data as fallback
        setItems(SAMPLE_ITEMS);
        setFilteredItems(SAMPLE_ITEMS);
      }
    } catch {
      // Use sample data as fallback when API is unavailable
      setItems(SAMPLE_ITEMS);
      setFilteredItems(SAMPLE_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let results = [...items];
    
    if (searchQuery.trim()) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      results = results.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(results);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    let results = [...items];
    
    if (searchQuery.trim()) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (category !== 'All') {
      results = results.filter(item => item.category === category);
    }
    
    setFilteredItems(results);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
          <p className="text-sm text-[#EFAD1E] mt-1">Browse available equipment from students on your campus.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search equipment (e.g. Scientific Calculator, DSLR Camera)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
            />
          </div>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => handleCategoryClick(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#800000] bg-white min-w-[160px]"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            id="search-button"
            onClick={handleSearch}
            className="bg-[#800000] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-[#660000] transition"
          >
            Search
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-[#800000] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-[#FFF8E7] hover:border-[#EFAD1E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#800000]"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No equipment found matching your criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setFilteredItems(items); }}
              className="mt-4 text-[#800000] font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Equipment Grid */}
        {!loading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-[#EFAD1E]/60 transition group cursor-pointer"
                id={`product-card-${item.id}`}
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">[Equipment Image Placeholder]</span>
                  )}
                </div>
                {/* Card Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#800000] transition">{item.name}</h3>
                  <p className="text-base font-bold text-gray-900 mt-1">
                    ₱{(item.dailyRate || item.dailyRate === 0 ? item.dailyRate : 0).toFixed(2)} <span className="text-gray-500 text-sm font-normal">/ day</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Listed by {item.listerName || 'Unknown'} — <span className="text-gray-500">{item.category}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
