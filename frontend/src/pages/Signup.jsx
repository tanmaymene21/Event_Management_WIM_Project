import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <UserPlus className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            Create Account
          </h1>
          <p className="text-neutral-400 mt-2">
            Sign up to start managing events
          </p>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-lg border border-neutral-700 rounded-xl p-8">
          {error && (
            <div className="flex items-center space-x-3 text-red-400 mb-6 p-4 bg-red-400/10 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-neutral-400">
                <User className="w-4 h-4" />
                <span>Username</span>
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full p-3 rounded-lg bg-neutral-900/50 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-neutral-400">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg bg-neutral-900/50 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-neutral-400">
                <Lock className="w-4 h-4" />
                <span>Password</span>
              </label>
              <input
                type="password"
                placeholder="Choose a password"
                className="w-full p-3 rounded-lg bg-neutral-900/50 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center space-x-2 w-full p-4 rounded-lg bg-gradient-to-r from-orange-500 to-orange-800 hover:opacity-90 transition-opacity font-medium ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-neutral-400">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
