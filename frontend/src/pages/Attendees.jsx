// Attendees.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Mail, Loader2, AlertCircle, UserCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const LoadingState = () => (
  <div className="min-h-screen bg-black text-white p-6 pt-24">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
        Event Attendees
      </h1>
      <div className="flex items-center space-x-3 text-orange-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading attendees...</span>
      </div>
    </div>
  </div>
);

export default function Attendees() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { eventId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/events/${eventId}/attendees`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch attendees');
        }

        const data = await response.json();
        setAttendees(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId, user.token]);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Users className="w-8 h-8 text-orange-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
            Event Attendees
          </h1>
        </div>

        <div className="bg-white/5 border border-orange-700 rounded-xl p-6">
          {error ? (
            <div className="flex items-center space-x-3 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          ) : attendees.length > 0 ? (
            <div className="space-y-4">
              {attendees.map((attendee) => (
                <div
                  key={attendee._id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-orange-700/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-orange-500" />
                    </div>
                    <span className="font-medium">{attendee.username}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-500">
                    <Mail className="w-4 h-4" />
                    <span>{attendee.email}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No attendees have registered for this event yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
