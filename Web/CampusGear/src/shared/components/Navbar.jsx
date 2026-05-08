import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = (user?.firstname?.charAt(0) || '') + (user?.lastname?.charAt(0) || '');

  const navLinks = [
    { to: '/dashboard', label: 'Marketplace' },
    { to: '/my-listings', label: 'My Listings' },
    { to: '/transactions', label: 'Transactions' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-lg font-bold" id="navbar-logo">
              <span className="text-[#800000]">Campus</span>
              <span className="text-[#EFAD1E]">Gear</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition ${
                    isActive(link.to)
                      ? 'text-[#800000] border-b-2 border-[#800000] pb-0.5'
                      : 'text-gray-500 hover:text-[#800000]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user?.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition ${
                    isActive('/admin')
                      ? 'text-[#800000] border-b-2 border-[#800000] pb-0.5'
                      : 'text-gray-500 hover:text-[#800000]'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-[#800000] text-white flex items-center justify-center text-xs font-bold hover:bg-[#660000] transition"
              id="navbar-avatar"
            >
              {initials}
            </Link>
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

      {/* Maroon accent line under navbar */}
      <div className="h-0.5 bg-gradient-to-r from-[#800000] via-[#EFAD1E] to-[#800000]"></div>
    </nav>
  );
};

export default Navbar;
