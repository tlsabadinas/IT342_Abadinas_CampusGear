import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Electronics', 'Lab Equipment', 'Photography', 'Sports', 'Musical', 'Books'];

const SAMPLE_ITEMS = [
  { id: 1, name: 'Scientific Calculator', dailyRate: 5.00, lister: 'Sarah M.', category: 'Electronics' },
  { id: 2, name: 'DSLR Camera Kit', dailyRate: 25.00, lister: 'James R.', category: 'Photography' },
  { id: 3, name: 'Acoustic Guitar', dailyRate: 10.00, lister: 'Maria L.', category: 'Musical' },
  { id: 4, name: 'Lab Microscope', dailyRate: 15.00, lister: 'David K.', category: 'Lab Equipment' },
  { id: 5, name: 'Arduino Starter Kit', dailyRate: 8.00, lister: 'Alex T.', category: 'Electronics' },
  { id: 6, name: 'Tripod Stand', dailyRate: 5.00, lister: 'Nina C.', category: 'Photography' },
  { id: 7, name: 'Basketball', dailyRate: 3.00, lister: 'Rico S.', category: 'Sports' },
  { id: 8, name: 'Physics Textbook', dailyRate: 2.00, lister: 'Leah P.', category: 'Books' },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = (user?.firstname?.charAt(0) || '') + (user?.lastname?.charAt(0) || '');

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo & Nav Links */}
            <div className="flex items-center gap-8">
              <h1 className="text-lg font-bold">
                <span className="text-[#800000]">Campus</span>
                <span className="text-[#EFAD1E]">Gear</span>
              </h1>
              <div className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm font-medium text-[#800000] border-b-2 border-[#800000] pb-0.5">Marketplace</a>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-[#800000] transition">My Listings</a>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-[#800000] transition">Transactions</a>
                {user?.role === 'ROLE_ADMIN' && (
                  <a href="#" className="text-sm font-medium text-gray-500 hover:text-[#800000] transition">Admin</a>
                )}
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#800000] text-white flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <button
                id="logout-button"
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-[#800000] transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
          <p className="text-sm text-[#EFAD1E] mt-1">Browse available equipment from students on your campus.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search equipment (e.g. Scientific Calculator, DSLR Camera)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#800000] bg-white min-w-[160px]">
            <option>All Categories</option>
            {CATEGORIES.filter(c => c !== 'All').map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <button className="bg-[#800000] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-[#660000] transition">
            Search
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                i === 0
                  ? 'bg-[#800000] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-[#FFF8E7] hover:border-[#EFAD1E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SAMPLE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-[#EFAD1E]/60 transition group cursor-pointer"
            >
              {/* Image Placeholder */}
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center border-b border-gray-100">
                <span className="text-xs text-gray-400 font-medium">[Equipment Image Placeholder]</span>
              </div>
              {/* Card Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#800000] transition">{item.name}</h3>
                <p className="text-base font-bold text-gray-900 mt-1">${item.dailyRate.toFixed(2)} <span className="text-gray-500 text-sm font-normal">/ day</span></p>
                <p className="text-xs text-gray-400 mt-2">Listed by {item.lister} — <span className="text-gray-500">{item.category}</span></p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
