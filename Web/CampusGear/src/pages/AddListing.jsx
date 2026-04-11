import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATEGORIES = ['Electronics', 'Lab Equipment', 'Photography', 'Sports', 'Musical', 'Books'];
const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Needs Repair'];

const AddListing = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!name.trim()) { setError('Equipment name is required'); return; }
    if (!price || parseFloat(price) <= 0) { setError('A valid daily rate is required'); return; }
    if (!category) { setError('Please select a category'); return; }

    setIsLoading(true);

    try {
      const data = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category,
        condition: condition || null,
        location: location.trim() || null,
        imageUrl: imageUrl.trim() || null,
        stock: 1,
      };

      const response = await productApi.create(data);
      if (response.data.success) {
        setSuccess('Listing created successfully!');
        setTimeout(() => navigate('/my-listings'), 1500);
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.details || err.response?.data?.error?.message || 'Failed to create listing. Please try again.';
      setError(typeof errMsg === 'object' ? Object.values(errMsg).join('. ') : errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Equipment Listing</h2>
          <p className="text-sm text-gray-500 mt-1">List your equipment for other students to rent.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Equipment Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Equipment Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Canon EOS M50 Camera Kit"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your equipment, what's included, any specifics..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent resize-y"
              />
            </div>

            {/* Daily Rate & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Daily Rate (₱) *
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#800000] bg-white"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Condition & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="condition" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Condition
                </label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#800000] bg-white"
                >
                  <option value="">Select condition</option>
                  {CONDITIONS.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="location" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Pickup Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Engineering Building, Room 204"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Image URL
              </label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Paste a Cloudinary or ImgBB image URL</p>
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full max-h-64 object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                id="submit-listing"
                type="submit"
                disabled={isLoading}
                className="bg-[#800000] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#660000] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? 'Creating...' : 'Create Listing'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-listings')}
                className="bg-white text-gray-700 font-semibold py-3 px-8 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddListing;
