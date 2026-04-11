import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SAMPLE_PRODUCTS = {
  1: { id: 1, name: 'Scientific Calculator', dailyRate: 5.00, listerName: 'Sarah M.', category: 'Electronics', description: 'Casio FX-991ES Plus scientific calculator. Perfect for calculus, statistics, and engineering courses.', condition: 'Good', location: 'Engineering Building, Room 101', status: 'AVAILABLE', imageUrl: '' },
  2: { id: 2, name: 'DSLR Camera Kit', dailyRate: 25.00, listerName: 'James R.', category: 'Photography', description: 'Professional-grade DSLR camera with 18-55mm and 55-200mm lenses, carrying case, extra battery, and 64GB SD card. Perfect for photography assignments, events, or creative projects.', condition: 'Excellent', location: 'Engineering Building, Room 204', status: 'AVAILABLE', imageUrl: '' },
  3: { id: 3, name: 'Acoustic Guitar', dailyRate: 10.00, listerName: 'Maria L.', category: 'Musical', description: 'Yamaha F310 acoustic guitar in great condition. Comes with a soft case and pick set.', condition: 'Good', location: 'Music Building, Room 302', status: 'AVAILABLE', imageUrl: '' },
  4: { id: 4, name: 'Lab Microscope', dailyRate: 15.00, listerName: 'David K.', category: 'Lab Equipment', description: 'Compound microscope with 40x-1000x magnification. Great for biology and chemistry lab work.', condition: 'Excellent', location: 'Science Building, Lab 5', status: 'AVAILABLE', imageUrl: '' },
  5: { id: 5, name: 'Arduino Starter Kit', dailyRate: 8.00, listerName: 'Alex T.', category: 'Electronics', description: 'Complete Arduino Mega 2560 starter kit with sensors, LEDs, breadboard, and project booklet.', condition: 'Good', location: 'Tech Hub, Room 110', status: 'AVAILABLE', imageUrl: '' },
  6: { id: 6, name: 'Tripod Stand', dailyRate: 5.00, listerName: 'Nina C.', category: 'Photography', description: 'Professional tripod stand for cameras and smartphones. Adjustable height up to 170cm.', condition: 'Good', location: 'Media Center', status: 'AVAILABLE', imageUrl: '' },
  7: { id: 7, name: 'Basketball', dailyRate: 3.00, listerName: 'Rico S.', category: 'Sports', description: 'Molten official size basketball. Great for pickup games or practice.', condition: 'Good', location: 'Gym', status: 'AVAILABLE', imageUrl: '' },
  8: { id: 8, name: 'Physics Textbook', dailyRate: 2.00, listerName: 'Leah P.', category: 'Books', description: 'University Physics with Modern Physics by Young & Freedman, 15th Edition.', condition: 'Fair', location: 'Library', status: 'AVAILABLE', imageUrl: '' },
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && product) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days > 0) {
        setEstimatedTotal(days * product.dailyRate);
        setError('');
      } else {
        setEstimatedTotal(0);
        if (startDate && endDate) setError('End date must be after start date');
      }
    } else {
      setEstimatedTotal(0);
    }
  }, [startDate, endDate, product]);

  const fetchProduct = async () => {
    try {
      const response = await productApi.getById(id);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch {
      // fallback to sample data
      const sample = SAMPLE_PRODUCTS[id];
      if (sample) {
        setProduct(sample);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      setError('End date must be after start date');
      return;
    }

    navigate('/checkout', {
      state: {
        product,
        startDate,
        endDate,
        totalDays: days,
        estimatedTotal,
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <div className="flex justify-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#800000]"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500 text-lg">Product not found.</p>
          <Link to="/dashboard" className="text-[#800000] font-medium hover:underline mt-4 inline-block">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Back link */}
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-[#800000] transition mb-6 inline-flex items-center gap-1"
          id="back-to-marketplace"
        >
          ← Back to Marketplace
        </Link>

        {/* Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4">
          {/* Left: Image */}
          <div className="bg-gray-100 rounded-xl flex items-center justify-center min-h-[400px] overflow-hidden">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-sm text-gray-400 font-medium">[High-Resolution Equipment Image Placeholder]</span>
            )}
          </div>

          {/* Right: Details */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900" id="product-name">{product.name}</h1>
            <p className="text-xl font-bold text-gray-900 mt-2">
              ₱{product.dailyRate?.toFixed(2)} <span className="text-gray-500 text-base font-normal">/ day</span>
            </p>

            <p className="text-gray-600 text-sm mt-4 leading-relaxed">{product.description}</p>

            {/* Info Table */}
            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 border-b border-gray-200 px-4 py-3">
                <span className="text-sm text-gray-500">Category</span>
                <span className="text-sm font-medium text-[#800000] text-right">{product.category}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-200 px-4 py-3">
                <span className="text-sm text-gray-500">Condition</span>
                <span className="text-sm font-medium text-[#800000] text-right">{product.condition || 'Good'}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-200 px-4 py-3">
                <span className="text-sm text-gray-500">Listed By</span>
                <span className="text-sm font-medium text-gray-900 text-right">{product.listerName}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-200 px-4 py-3">
                <span className="text-sm text-gray-500">Location</span>
                <span className="text-sm font-medium text-gray-900 text-right">{product.location || 'Campus'}</span>
              </div>
              <div className="grid grid-cols-2 px-4 py-3">
                <span className="text-sm text-gray-500">Availability</span>
                <span className={`text-sm font-medium text-right ${product.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-500'}`}>
                  {product.status === 'AVAILABLE' ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Rental Date Selection */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Rental Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Start Date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    End Date
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-3">{error}</p>
            )}

            {/* Estimated Total */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <span className="text-base font-semibold text-gray-900">Estimated Total</span>
              <span className="text-xl font-bold text-gray-900">₱{estimatedTotal.toFixed(2)}</span>
            </div>

            {/* Proceed Button */}
            <button
              id="proceed-to-checkout"
              onClick={handleProceedToCheckout}
              disabled={product.status !== 'AVAILABLE'}
              className="w-full mt-6 bg-[#1A1A1A] text-white font-semibold py-3.5 rounded-lg hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
