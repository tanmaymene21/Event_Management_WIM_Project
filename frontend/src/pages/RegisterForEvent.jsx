import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import emailjs from 'emailjs-com';
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Info,
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { createApi } from 'unsplash-js';

const UNSPLASH_CLIENTID = import.meta.env.VITE_UNSPLASH_CLIENTID;

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID_REGISTER = import.meta.env
  .VITE_EMAILJS_TEMPLATE_ID_REGISTER;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const unsplash = createApi({
  accessKey: UNSPLASH_CLIENTID,
});

const API_URL = import.meta.env.VITE_API_URL;

const LoadingState = () => (
  <div className="min-h-screen bg-neutral-900 text-white p-6 pt-24">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
        Event Details
      </h1>
      <div className="flex items-center space-x-3 text-orange-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading event details...</span>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="min-h-screen bg-neutral-900 text-white p-6 pt-24">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 text-red-400 mb-4">
        <AlertCircle className="w-6 h-6" />
        <h1 className="text-4xl font-bold">Error</h1>
      </div>
      <p className="text-red-400">{error}</p>
    </div>
  </div>
);

export default function RegisterForEvent() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [eventImage, setEventImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const userData = user.user;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch event');
        }

        const data = await response.json();
        setEvent(data);

        const result = await unsplash.search.getPhotos({
          query: data.name,
          perPage: 1,
        });

        if (result.errors) {
          throw new Error(result.errors.join(', '));
        } else if (result.response.results.length > 0) {
          setEventImage(result.response.results[0].urls.regular);
        } else {
          setEventImage('fallback-image-url.jpg');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchEvent();
    }
  }, [eventId, user]);

  const sendConfirmationEmail = async (registration) => {
    try {
      const emailParams = {
        to_email: userData.email,
        to_name: userData.username,
        event_name: event.name,
        event_date: event.date || 'TBA',
        event_description: event.description,
        registration_id: registration._id,
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_REGISTER,
        emailParams,
        EMAILJS_PUBLIC_KEY,
      );

      if (response.status === 200) {
        toast.success('Registration confirmation sent to your email!');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error('Failed to send confirmation email');
    }
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);

      const response = await fetch(
        `${API_URL}/api/events/${eventId}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const registrationData = await response.json();

      // Send confirmation email
      await sendConfirmationEmail(registrationData.registration);
      // toast.error('Send Email Function is Disabled');
      navigate('/myregistrations');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Calendar className="w-8 h-8 text-orange-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            Event Details
          </h1>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-lg border border-neutral-700 rounded-xl overflow-hidden">
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src={eventImage || 'fallback-image-url.jpg'}
              alt={event?.name || 'Event Image'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">{event?.name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-neutral-400">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>{event?.date || 'Date TBA'}</span>
                </div>
                <div className="flex items-center space-x-3 text-neutral-400">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span>{event?.attendees?.length || 0} Registered</span>
                </div>
                <div className="flex items-center space-x-3 text-neutral-400">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span>{event?.location || 'Location TBA'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-neutral-400">
                  <Info className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <p>{event?.description || 'No description available.'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={registering}
              className={`flex items-center justify-center space-x-2 w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-800 hover:opacity-90 transition-opacity ${
                registering ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {registering ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  <span>Register for Event</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
