import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, firstname, lastname);
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.error) {
        if (errorData.error.code === 'VALID-001' && typeof errorData.error.details === 'object') {
          setFieldErrors(errorData.error.details);
        } else {
          setError(errorData.error.details || errorData.error.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Maroon Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#800000] text-white flex-col justify-center items-center px-16">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">
            <span className="text-white">Campus</span>
            <span className="text-[#EFAD1E]">Gear</span>
          </h1>
          <p className="text-red-200 text-base mb-10 leading-relaxed">
            The campus marketplace where students rent equipment from each other — affordable, secure, and local.
          </p>
          <div className="text-left space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#EFAD1E] mt-0.5">◎</span>
              <span className="text-red-100 text-sm">List your idle gear and earn extra income</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#EFAD1E] mt-0.5">◎</span>
              <span className="text-red-100 text-sm">Rent what you need at student-friendly prices</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#EFAD1E] mt-0.5">◎</span>
              <span className="text-red-100 text-sm">Verified campus community with secure payments</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#EFAD1E] mt-0.5">◎</span>
              <span className="text-red-100 text-sm">Search by category, name, or availability</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm mb-8">Join your campus rental community today.</p>

          {/* Google Sign Up */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z"/>
              <path fill="#FBBC05" d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.48 0 2.438 2.017.956 4.958l3.008 2.332c.708-2.127 2.692-3.71 5.036-3.71z"/>
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">or register with email</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4 flex items-center gap-2" id="register-success">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4" id="register-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstname" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  First Name
                </label>
                <input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="e.g. Treasure Louise"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                />
                {fieldErrors.firstname && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstname}</p>}
              </div>
              <div>
                <label htmlFor="lastname" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Last Name
                </label>
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="e.g. Abadinas"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                />
                {fieldErrors.lastname && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastname}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@cit.edu"
                required
                autoComplete="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
              />
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Must include uppercase, number, and special character</p>
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
              />
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#800000] text-white font-semibold py-3 rounded-lg hover:bg-[#660000] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" id="goto-login" className="text-[#800000] font-semibold underline hover:text-[#660000]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
