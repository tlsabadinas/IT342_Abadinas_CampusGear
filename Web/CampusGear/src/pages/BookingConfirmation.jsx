import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, cardLastFour } = location.state || {};

  if (!order) {
    navigate('/dashboard');
    return null;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatPeriod = () => {
    const start = formatDate(order.startDate);
    const end = formatDate(order.endDate);
    return `${start} - ${end}`;
  };

  const getPaymentDisplay = () => {
    if (order.paymentMethod === 'Credit / Debit Card' && cardLastFour) {
      return `Visa ending ${cardLastFour}`;
    }
    return order.paymentMethod || 'Sandbox Payment';
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 mx-auto mb-6 border-2 border-gray-900 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900">OK</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2" id="confirmation-title">Booking Confirmed</h1>
          <p className="text-sm text-gray-500 mb-8">
            Your rental has been booked successfully. A confirmation receipt has been sent to your email.
          </p>

          {/* Booking Details Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden text-left mb-8">
            <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-3">
              <span className="text-sm text-gray-500">Booking ID</span>
              <span className="text-sm font-semibold text-gray-900 text-right">{order.orderNumber}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-3">
              <span className="text-sm text-gray-500">Item</span>
              <span className="text-sm font-semibold text-gray-900 text-right">{order.productName}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-3">
              <span className="text-sm text-gray-500">Lender</span>
              <span className="text-sm font-semibold text-gray-900 text-right">{order.lenderName}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-3">
              <span className="text-sm text-gray-500">Rental Period</span>
              <span className="text-sm font-semibold text-gray-900 text-right">{formatPeriod()}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-3">
              <span className="text-sm text-gray-500">Total Paid</span>
              <span className="text-sm font-semibold text-[#800000] text-right">₱{order.total?.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-200 px-5 py-3">
              <span className="text-sm text-gray-500">Payment Method</span>
              <span className="text-sm font-semibold text-gray-900 text-right">{getPaymentDisplay()}</span>
            </div>
            <div className="grid grid-cols-2 px-5 py-3">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-sm font-semibold text-green-600 text-right">Confirmed</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Link
              to="/transactions"
              id="view-transactions"
              className="px-6 py-2.5 bg-[#800000] text-white text-sm font-semibold rounded-lg hover:bg-[#660000] transition"
            >
              View My Transactions
            </Link>
            <Link
              to="/dashboard"
              id="back-to-marketplace"
              className="px-6 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
