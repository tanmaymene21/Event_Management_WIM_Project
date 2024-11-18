import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Type,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateEvent() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = JSON.parse(localStorage.getItem('userData'))?.token;
      const response = await fetch(`${API_URL}/api/events/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, date, location }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      navigate('/myevents');
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
          <Calendar className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            Create Event
          </h1>
          <p className="text-neutral-400 mt-2">
            Fill in the details for your new event
          </p>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-lg border border-neutral-700 rounded-xl p-8">
          {error && (
            <div className="flex items-center space-x-3 text-red-400 mb-6 p-4 bg-red-400/10 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleCreateEvent} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-neutral-400">
                <Type className="w-4 h-4" />
                <span>Event Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter event name"
                className="w-full p-3 rounded-lg bg-neutral-900/50 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-neutral-400">
                <FileText className="w-4 h-4" />
                <span>Description</span>
              </label>
              <textarea
                placeholder="Enter event description"
                className="w-full p-3 rounded-lg bg-neutral-900/50 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-neutral-400">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </label>
              <input
                type="date"
                className="w-full p-3 rounded-lg bg-neutral-900/50 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-neutral-400">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </label>
              <input
                type="text"
                placeholder="Enter event location"
                className="w-full p-3 rounded-lg bg-neutral-900/50 border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
                  <span>Creating Event...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  <span>Create Event</span>
                </>
              )}
            </button>

            <div className="mt-6 text-center text-neutral-400">
              <span>Want to browse events instead? </span>
              <a
                href="/events"
                className="text-orange-500 hover:text-orange-400 transition-colors"
              >
                View Events
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
