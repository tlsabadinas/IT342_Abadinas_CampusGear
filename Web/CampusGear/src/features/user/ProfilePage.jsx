import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userApi.getProfile();
      if (response.data.success) {
        const data = response.data.data;
        setProfileData(data);
        setFirstname(data.firstname || '');
        setLastname(data.lastname || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
      }
    } catch {
      // Use auth context as fallback
      if (user) {
        setProfileData({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          listingsCount: 0,
          rentalsCount: 0,
          totalEarned: 0,
          createdAt: null,
        });
        setFirstname(user.firstname || '');
        setLastname(user.lastname || '');
        setEmail(user.email || '');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    if (newPassword && !currentPassword) {
      setError('Current password is required to set a new password');
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        firstname,
        lastname,
        phone,
        bio,
      };

      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      const response = await userApi.updateProfile(updateData);
      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.details || err.response?.data?.error?.message || 'Failed to update profile';
      setError(typeof errMsg === 'object' ? Object.values(errMsg).join('. ') : errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const initials = (firstname?.charAt(0) || '') + (lastname?.charAt(0) || '');

  const formatMemberSince = () => {
    if (!profileData?.createdAt) return 'Member';
    const date = new Date(profileData.createdAt);
    return `Member since ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
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

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-sm text-gray-500 mt-1">View and update your account information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: User Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              {/* Avatar */}
              <div className="w-20 h-20 mx-auto rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-2xl font-bold mb-4">
                {initials}
              </div>

              <h3 className="font-bold text-gray-900 text-lg">{firstname} {lastname}</h3>
              <p className="text-sm text-gray-500 mt-1">{email}</p>
              <p className="text-xs text-gray-400 mt-1">{formatMemberSince()}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{profileData?.listingsCount || 0}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{profileData?.rentalsCount || 0}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Rentals</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">₱{profileData?.totalEarned?.toFixed?.(0) || 0}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Earned</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Account Settings */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Account Settings</h3>

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

              <form onSubmit={handleSave} className="space-y-5">
                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullname" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="fullname"
                      type="text"
                      value={`${firstname} ${lastname}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(' ');
                        setFirstname(parts[0] || '');
                        setLastname(parts.slice(1).join(' ') || '');
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="username" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={`${firstname?.toLowerCase() || ''}${lastname?.toLowerCase() || ''}_26`}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 bg-gray-50"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="profile-email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 bg-gray-50"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="profile-phone" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Phone
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09XX XXX XXXX"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell other students a bit about yourself..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent resize-y"
                  />
                </div>

                {/* Change Password Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-base font-bold text-gray-900 mb-4">Change Password</h4>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                        Current Password
                      </label>
                      <input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="new-password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                          New Password
                        </label>
                        <input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 8 characters"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm-new-password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          id="confirm-new-password"
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  id="save-profile"
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#1A1A1A] text-white font-semibold py-3 px-8 rounded-lg hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
