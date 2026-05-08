import { useState, useEffect } from 'react';
import { orderApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState('rentals');
  const [rentals, setRentals] = useState([]);
  const [lendings, setLendings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const [rentalsRes, lendingsRes] = await Promise.all([
        orderApi.getMyRentals(),
        orderApi.getMyLendings(),
      ]);
      if (rentalsRes.data.success) setRentals(rentalsRes.data.data);
      if (lendingsRes.data.success) setLendings(lendingsRes.data.data);
    } catch {
      // Fallback sample data
      setRentals([
        { id: 1, orderNumber: '#CG-2026-0847', productName: 'DSLR Camera Kit', startDate: '2026-03-03', endDate: '2026-03-05', total: 78.75, status: 'ACTIVE' },
        { id: 2, orderNumber: '#CG-2026-0831', productName: 'Lab Microscope', startDate: '2026-02-25', endDate: '2026-02-27', total: 33.75, status: 'COMPLETED' },
        { id: 3, orderNumber: '#CG-2026-0819', productName: 'Scientific Calculator', startDate: '2026-02-18', endDate: '2026-02-22', total: 26.25, status: 'COMPLETED' },
        { id: 4, orderNumber: '#CG-2026-0805', productName: 'Mountain Bike', startDate: '2026-02-10', endDate: '2026-02-12', total: 27.00, status: 'COMPLETED' },
      ]);
      setLendings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = (start, end) => {
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      CONFIRMED: 'border-green-300 text-green-700',
      ACTIVE: 'border-blue-300 text-blue-700',
      COMPLETED: 'border-gray-300 text-gray-600',
      CANCELLED: 'border-red-300 text-red-700',
      PENDING_PAYMENT: 'border-yellow-300 text-yellow-700',
    };
    const labels = {
      CONFIRMED: 'Confirmed',
      ACTIVE: 'Active',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      PENDING_PAYMENT: 'Pending',
    };
    return (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'border-gray-300 text-gray-600'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const currentData = activeTab === 'rentals' ? rentals : lendings;

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          <p className="text-sm text-gray-500 mt-1">View your rental bookings and lending history.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('rentals')}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === 'rentals'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            My Rentals
          </button>
          <button
            onClick={() => setActiveTab('lendings')}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === 'lendings'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            My Lending
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#800000]"></div>
          </div>
        )}

        {!loading && currentData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {activeTab === 'rentals' ? 'No rental transactions yet.' : 'No lending transactions yet.'}
            </p>
          </div>
        )}

        {!loading && currentData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 px-6 py-3 bg-gray-50 border-b border-gray-200">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking ID</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Item</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dates</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
            </div>

            {/* Table Rows */}
            {currentData.map((txn, index) => (
              <div
                key={txn.id || index}
                className={`grid grid-cols-5 px-6 py-4 items-center ${
                  index < currentData.length - 1 ? 'border-b border-gray-100' : ''
                } hover:bg-gray-50 transition`}
              >
                <span className="text-sm font-medium text-gray-900">{txn.orderNumber}</span>
                <span className="text-sm text-[#800000] font-medium">{txn.productName}</span>
                <span className="text-sm text-gray-600">{formatDateRange(txn.startDate, txn.endDate)}</span>
                <span className="text-sm font-semibold text-gray-900">₱{txn.total?.toFixed(2)}</span>
                <div>{getStatusBadge(txn.status)}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TransactionHistory;
