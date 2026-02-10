import { useState } from "react";
import axios from 'axios';
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      console.log(response.data);
      navigate("/home")
    } catch (error) {
      console.error('There was an error!', error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-pink-50 border border-pink-300 p-6">
          <h1 className="text-xl font-bold text-center mb-6">Login</h1>

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-3 py-2 border border-pink-300 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-3 py-2 border border-pink-300 focus:outline-none focus:border-pink-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-pink-600 hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
