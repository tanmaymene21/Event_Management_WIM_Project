import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createApi } from 'unsplash-js';
import {
  Calendar,
  Users,
  Loader2,
  AlertCircle,
  ArrowRight,
  Clock,
} from 'lucide-react';

const UNSPLASH_CLIENTID = import.meta.env.VITE_UNSPLASH_CLIENTID;
const unsplash = createApi({
  accessKey: `${UNSPLASH_CLIENTID}`,
});

const API_URL = import.meta.env.VITE_API_URL;

const LoadingState = ({ title }) => (
  <div className="min-h-screen p-6 pt-24">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
        {title}
      </h1>
      <div className="flex items-center space-x-3 text-orange-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="min-h-screen p-6 pt-24">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 text-red-500 mb-4">
        <AlertCircle className="w-6 h-6" />
        <h1 className="text-4xl font-bold">Error</h1>
      </div>
      <p className="text-red-500">{error}</p>
    </div>
  </div>
);

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [eventImages, setEventImages] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events/mycreatedevents`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data);

        const images = await Promise.all(
          data.map(async (event) => {
            const result = await unsplash.search.getPhotos({
              query: event.name,
              perPage: 1,
            });
            return {
              id: event._id,
              url:
                result.response?.results[0]?.urls?.regular ||
                '/default-image.jpg',
            };
          }),
        );

        const imageMap = images.reduce((acc, { id, url }) => {
          acc[id] = url;
          return acc;
        }, {});
        setEventImages(imageMap);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchEvents();
    }
  }, [user]);

  if (loading) return <LoadingState title="My Events" />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
              My Events
            </h1>
          </div>
          <Link
            to="/events/create"
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 text-white hover:from-orange-600 hover:to-orange-900 transition-colors"
          >
            <span>Create New Event</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="border border-orange-700 rounded-lg p-8 text-center shadow-sm shadow-orange-400">
            <p className="text-neutral-500 mb-4">
              You haven't created any events yet.
            </p>
            <Link
              to="/events/create"
              className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors"
            >
              Create Your First Event <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="group rounded-lg overflow-hidden border border-orange-700 shadow-sm shadow-orange-400 transition-all duration-300 hover:shadow-md hover:shadow-orange-500"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={eventImages[event._id] || '/default-image.jpg'}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors">
                    {event.name}
                  </h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-neutral-500">
                      <Clock className="w-4 h-4" />
                      <span>{event.date || 'Date TBA'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-neutral-500">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees?.length || 0} Registered</span>
                    </div>
                  </div>

                  <Link
                    to={`/events/${event._id}/attendees`}
                    className="flex items-center space-x-2 w-full justify-center px-4 py-2 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 text-white hover:from-orange-600 hover:to-orange-900 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>View Attendees</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
