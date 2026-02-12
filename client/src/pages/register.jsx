import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || !username.trim() || !password.trim() || !confirmPass.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPass) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, { name, username, password, confirm: confirmPass });
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error('There was an error!', error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="p-10">
          <h1 className="text-4xl font-bold text-center mb-10 text-pink-600">Create Account</h1>

          {error && (
            <p className="text-red-600 text-sm mb-6 p-3 bg-red-50 rounded-2xl">{error}</p>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-6">
              <label className="block text-sm mb-2 text-pink-700 font-semibold">Full Name</label>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 bg-gradient-to-r from-pink-100 to-white border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 text-pink-700 font-semibold">Username</label>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 bg-gradient-to-r from-pink-100 to-white border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 text-pink-700 font-semibold">Password</label>
              <input
                type="password"
                placeholder="Passwword"
                className="w-full px-4 py-3 bg-gradient-to-r from-pink-100 to-white border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm mb-2 text-pink-700 font-semibold">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 bg-gradient-to-r from-pink-100 to-white border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                value={confirmPass}
                onChange={(e) => {
                  setConfirmPass(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full font-bold text-lg transition"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            Already have an account?{' '}
            <a href="/" className="text-pink-600 hover:text-pink-700 font-bold hover:underline">
              Login here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default register;