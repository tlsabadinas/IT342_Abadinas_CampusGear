import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { product, startDate, endDate, totalDays, estimatedTotal } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');
  const [contactName, setContactName] = useState(user ? `${user.firstname} ${user.lastname}` : '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!product || !startDate || !endDate) {
    navigate('/dashboard');
    return null;
  }

  const subtotal = product.dailyRate * totalDays;
  const serviceFee = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + serviceFee;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handlePlaceBooking = async () => {
    setError('');

    if (!contactName.trim()) { setError('Full name is required'); return; }
    if (!contactEmail.trim()) { setError('Email is required'); return; }
    if (!contactPhone.trim()) { setError('Phone number is required'); return; }

    if (paymentMethod === 'Credit / Debit Card') {
      if (!cardNumber.trim()) { setError('Card number is required'); return; }
      if (!expiryDate.trim()) { setError('Expiry date is required'); return; }
      if (!cvc.trim()) { setError('CVC is required'); return; }
    }

    setIsLoading(true);

    try {
      const orderData = {
        productId: product.id,
        startDate: startDate,
        endDate: endDate,
        paymentMethod: paymentMethod,
        shippingAddress: pickupLocation,
        cardLastFour: cardNumber ? cardNumber.slice(-4) : null,
      };

      const response = await orderApi.create(orderData);
      if (response.data.success) {
        navigate('/booking-confirmation', {
          state: {
            order: response.data.data,
            cardLastFour: cardNumber ? cardNumber.slice(-4) : null,
          }
        });
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Cannot connect to the server. Please make sure the backend is running.');
      } else {
        const errMsg = err.response?.data?.error?.details || err.response?.data?.error?.message || 'Failed to place booking. Please try again.';
        setError(typeof errMsg === 'object' ? Object.values(errMsg).join('. ') : errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = ['Credit / Debit Card', 'PayPal (Sandbox)', 'GCash (Sandbox)'];

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          <p className="text-sm text-gray-500 mt-1">Review your rental and complete your payment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              {/* Contact Information */}
              <h3 className="text-base font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="firstname.lastname@cit.edu"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="09XX XXX XXXX"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                />
              </div>

              {/* Pickup Details */}
              <h3 className="text-base font-bold text-gray-900 mb-4">Pickup Details</h3>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Preferred Pickup Location
                </label>
                <input
                  id="pickup-location"
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Library Main Lobby"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Notes for Lender
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or notes..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent resize-y"
                />
              </div>

              {/* Payment Method */}
              <h3 className="text-base font-bold text-gray-900 mb-4">Payment Method</h3>
              <div className="flex gap-3 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition ${
                      paymentMethod === method
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {/* Card Fields (shown only for Credit/Debit) */}
              {paymentMethod === 'Credit / Debit Card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                      Card Number
                    </label>
                    <input
                      id="card-number"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        id="expiry-date"
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                        CVC
                      </label>
                      <input
                        id="cvc"
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#EFAD1E]">Sandbox mode — no real charges will be made.</p>
                </div>
              )}

              {paymentMethod !== 'Credit / Debit Card' && (
                <p className="text-xs text-[#EFAD1E] mb-6">Sandbox mode — no real charges will be made. Click "Place Booking" to simulate payment.</p>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4" id="checkout-error">
                  {error}
                </div>
              )}

              {/* Place Booking Button */}
              <button
                id="place-booking"
                onClick={handlePlaceBooking}
                disabled={isLoading}
                className="w-full bg-[#1A1A1A] text-white font-semibold py-3.5 rounded-lg hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? 'Processing...' : 'Place Booking'}
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-20">
              <h3 className="text-base font-bold text-[#800000] mb-4">Order Summary</h3>

              {/* Product Preview */}
              <div className="flex gap-3 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-gray-400">[Image]</span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">{product.name}</h4>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <p className="text-xs text-gray-500">{totalDays} days rental</p>
                </div>
              </div>

              {/* Summary Lines */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Daily Rate</span>
                  <span className="text-gray-900">₱{product.dailyRate?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="text-gray-900">{totalDays} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service Fee</span>
                  <span className="text-gray-900">₱{serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-3">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₱{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
