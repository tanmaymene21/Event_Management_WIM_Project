// Events.js
import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('http://localhost:3000/api/events');
      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
          Discover Events
        </h1>
        <p className="text-neutral-500 text-lg max-w-2xl">
          Join exciting events happening around you. From tech talks to workshops, 
          find the perfect event that matches your interests.
        </p>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}