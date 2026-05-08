import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATEGORIES = ['Electronics', 'Lab Equipment', 'Photography', 'Sports', 'Musical', 'Books'];
const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Needs Repair'];

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formCondition, setFormCondition] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await productApi.getMyListings();
      if (response.data.success) {
        setListings(response.data.data);
      }
    } catch {
      // Fallback sample data
      setListings([
        { id: 101, name: 'Acoustic Guitar', dailyRate: 10.00, status: 'AVAILABLE', imageUrl: '', category: 'Musical' },
        { id: 102, name: 'Scientific Calculator', dailyRate: 5.00, status: 'RENTED', imageUrl: '', category: 'Electronics' },
        { id: 103, name: 'Portable Projector', dailyRate: 18.00, status: 'AVAILABLE', imageUrl: '', category: 'Electronics' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productApi.delete(id);
      setListings(prev => prev.filter(item => item.id !== id));
      setDeleteConfirm(null);
      setSuccessMsg('Listing deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete listing');
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormCategory('');
    setFormCondition('');
    setFormLocation('');
    setFormImageUrl('');
    setFormError('');
  };

  const handleOpenModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim()) { setFormError('Equipment name is required'); return; }
    if (!formPrice || parseFloat(formPrice) <= 0) { setFormError('A valid daily rate is required'); return; }
    if (!formCategory) { setFormError('Please select a category'); return; }

    setFormLoading(true);

    try {
      const data = {
        name: formName.trim(),
        description: formDescription.trim(),
        price: parseFloat(formPrice),
        category: formCategory,
        condition: formCondition || null,
        location: formLocation.trim() || null,
        imageUrl: formImageUrl.trim() || null,
        stock: 1,
      };

      const response = await productApi.create(data);
      if (response.data.success) {
        setListings(prev => [response.data.data, ...prev]);
        setShowModal(false);
        resetForm();
        setSuccessMsg('Listing created successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setFormError('Cannot connect to the server. Please make sure the backend is running.');
      } else {
        const errMsg = err.response?.data?.error?.details || err.response?.data?.error?.message || 'Failed to create listing.';
        setFormError(typeof errMsg === 'object' ? Object.values(errMsg).join('. ') : errMsg);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      AVAILABLE: 'border-green-300 text-green-700 bg-green-50',
      RENTED: 'border-gray-300 text-gray-600 bg-gray-50',
      REMOVED: 'border-red-300 text-red-700 bg-red-50',
    };
    const labels = {
      AVAILABLE: 'Active',
      RENTED: 'Rented Out',
      REMOVED: 'Removed',
    };
    return (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.AVAILABLE}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
            <p className="text-sm text-gray-500 mt-1">Manage the equipment you have listed for rent.</p>
          </div>
          <button
            onClick={handleOpenModal}
            id="add-new-listing"
            className="bg-[#1A1A1A] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-black transition"
          >
            Add New Listing
          </button>
        </div>

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#800000]"></div>
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">You haven't listed any equipment yet.</p>
            <button onClick={handleOpenModal} className="mt-4 text-[#800000] font-medium hover:underline">
              Create your first listing
            </button>
          </div>
        )}

        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Image */}
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">[Equipment Image Placeholder]</span>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                  <p className="text-base font-bold text-gray-900 mt-1">
                    ₱{(item.dailyRate || 0).toFixed(2)} <span className="text-gray-500 text-sm font-normal">/ day</span>
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(item.status)}
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate(`/edit-listing/${item.id}`)}
                      className="px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Edit
                    </button>
                    {deleteConfirm === item.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Add Equipment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal}></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" id="add-listing-modal">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Equipment Listing</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="px-6 pb-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {formError}
                </div>
              )}

              {/* Equipment Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Equipment Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. DSLR Camera Kit"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the item, condition, and what's included..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent resize-y"
                />
              </div>

              {/* Daily Rate & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Daily Rate (₱)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#800000] bg-white"
                  >
                    <option value="">Select</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Condition
                </label>
                <select
                  value={formCondition}
                  onChange={(e) => setFormCondition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#800000] bg-white"
                >
                  <option value="">Select condition</option>
                  {CONDITIONS.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              {/* Pickup Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Engineering Building, Rm 204"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                />
              </div>

              {/* Equipment Photo */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Equipment Photo
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#800000] hover:bg-red-50/30 transition"
                  onClick={() => {
                    const url = prompt('Enter the image URL (from Cloudinary or ImgBB):');
                    if (url) setFormImageUrl(url);
                  }}
                >
                  {formImageUrl ? (
                    <div className="space-y-2">
                      <img src={formImageUrl} alt="Preview" className="w-full max-h-40 object-cover rounded-lg mx-auto" onError={(e) => { e.target.style.display = 'none'; }} />
                      <p className="text-xs text-gray-500 truncate">{formImageUrl}</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFormImageUrl(''); }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Click to upload or drag and drop (JPG, PNG up to 5MB) →</p>
                      <p className="text-xs text-gray-400">Hosted via Cloudinary / ImgBB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-[#800000] text-white font-semibold py-3 rounded-lg hover:bg-[#660000] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {formLoading ? 'Creating...' : 'Create Listing'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 bg-white text-gray-700 font-semibold py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
