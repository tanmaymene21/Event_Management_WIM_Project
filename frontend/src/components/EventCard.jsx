import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

export default function EventCard({ event }) {
  const [imageUrl, setImageUrl] = useState('');

  const UNSPLASH_CLIENTID = import.meta.env.VITE_UNSPLASH_CLIENTID;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?client_id=${UNSPLASH_CLIENTID}&query=${encodeURIComponent(
            event.name
          )}&per_page=1`
        );
        const data = await response.json();
        if (data.results.length > 0) {
          setImageUrl(data.results[0].urls.regular);
        } else {
          setImageUrl('/default-image.jpg');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageUrl('/default-image.jpg');
      }
    };

    fetchImage();
  }, [event.name]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Link
      to={`/events/${event._id}/register`}
      className="group bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 border border-orange-700"
    >
      {/* Event Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-2 text-orange-500 text-sm mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(event.date)}</span>
        </div>

        <h2 className="text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors">
          {event.name}
        </h2>

        <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center space-x-4 text-sm text-neutral-500">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span className="text-nowrap">
              {event.attendees.length} attending
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center text-orange-500 font-medium">
          Register Now
          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
