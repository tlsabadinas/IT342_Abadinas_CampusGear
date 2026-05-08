import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-gray-300 mt-16" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-3">
              <span className="text-white">Campus</span>
              <span className="text-[#EFAD1E]">Gear</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              A peer-to-peer campus equipment rental marketplace built for students, by students. Rent what you need, list what you have.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-sm text-gray-400 hover:text-[#EFAD1E] transition">Marketplace</Link></li>
              <li><Link to="/my-listings" className="text-sm text-gray-400 hover:text-[#EFAD1E] transition">My Listings</Link></li>
              <li><Link to="/transactions" className="text-sm text-gray-400 hover:text-[#EFAD1E] transition">Transactions</Link></li>
              <li><Link to="/profile" className="text-sm text-gray-400 hover:text-[#EFAD1E] transition">Profile</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#EFAD1E] transition">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#EFAD1E] transition">Safety Guidelines</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#EFAD1E] transition">Community Rules</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#EFAD1E] transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#EFAD1E] transition">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#EFAD1E] transition">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#EFAD1E] transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center">
          <p className="text-sm text-gray-500">
            CampusGear 2026. All rights reserved. Built with Spring Boot, React, and Android.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
