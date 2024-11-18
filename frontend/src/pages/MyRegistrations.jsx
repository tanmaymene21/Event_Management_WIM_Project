import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import {
  Ticket,
  Calendar,
  MapPin,
  Download,
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { createApi } from 'unsplash-js';

// Unsplash API setup
const UNSPLASH_CLIENTID = import.meta.env.VITE_UNSPLASH_CLIENTID;
const unsplash = createApi({
  accessKey: `${UNSPLASH_CLIENTID}`, // Replace with your Unsplash API key
});

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

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [eventImages, setEventImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        if (!user?.token) {
          throw new Error('No authentication token available');
        }

        const response = await fetch(
          'http://localhost:3000/api/events/myregistrations',
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch registrations');
        }

        const data = await response.json();
        setRegistrations(data);

        // Fetch images for all events
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
          })
        );

        const imageMap = images.reduce((acc, { id, url }) => {
          acc[id] = url;
          return acc;
        }, {});
        setEventImages(imageMap);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchRegistrations();
    }
  }, [user]);

  const generateQRCode = async (text) => {
    try {
      return await QRCode.toDataURL(text);
    } catch (err) {
      console.error('QR Code generation error:', err);
      return null;
    }
  };

  const downloadTicket = async (registration) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [200, 100],
    });

    // Set background color
    doc.setFillColor(255, 248, 240); // Light orange background
    doc.rect(0, 0, 200, 100, 'F');

    // Add border with gradient-like effect
    doc.setDrawColor(249, 115, 22); // Orange border
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 190, 90);

    // Add decorative elements
    doc.setDrawColor(194, 65, 12); // Darker orange
    doc.setLineWidth(0.25);
    doc.rect(8, 8, 184, 84);

    // Add header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(249, 115, 22); // Orange text
    doc.text('EVENT TICKET', 100, 20, { align: 'center' });

    // Add subtitle
    doc.setFontSize(10);
    doc.setTextColor(194, 65, 12); // Darker orange
    doc.text('Event Master', 100, 26, { align: 'center' });

    // Reset text color for details
    doc.setTextColor(0);

    // Add event details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Event name
    doc.setFont('helvetica', 'bold');
    doc.text('Event:', 15, 35);
    doc.setFont('helvetica', 'normal');
    doc.text(registration.name, 35, 35);

    // Date and time
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 15, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(registration.date || 'TBA', 35, 45);

    // Location
    doc.setFont('helvetica', 'bold');
    doc.text('Location:', 15, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(registration.location || 'TBA', 35, 55);

    // Attendee details
    doc.setFont('helvetica', 'bold');
    doc.text('Attendee:', 15, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(user.name || 'Guest', 35, 65);

    // Registration ID
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Registration ID:', 15, 75);
    doc.setFont('helvetica', 'normal');
    doc.text(registration._id, 45, 75);

    // Generate and add QR code
    const qrCodeData = await generateQRCode(
      JSON.stringify({
        eventId: registration._id,
        eventName: registration.name,
        attendee: user.name,
        registrationId: registration._id,
      })
    );

    if (qrCodeData) {
      doc.addImage(qrCodeData, 'PNG', 140, 30, 40, 40);
    }

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      'This ticket is valid for one-time entry. Please present this ticket at the event.',
      100,
      85,
      { align: 'center' }
    );

    // Save the PDF
    doc.save(`${registration.name}-ticket.pdf`);
  };

  if (loading) return <LoadingState title="My Registrations" />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Ticket className="w-8 h-8 text-orange-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
            My Registrations
          </h1>
        </div>

        {registrations.length === 0 ? (
          <div className="border border-orange-700 rounded-lg p-8 text-center shadow-sm shadow-orange-400">
            <p className="text-neutral-500 mb-4">
              You haven't registered for any events yet.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors"
            >
              Browse Events <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {registrations.map((registration) => (
              <div
                key={registration._id}
                className="group rounded-lg overflow-hidden border border-orange-700 shadow-sm shadow-orange-400 transition-all duration-300 hover:shadow-md hover:shadow-orange-500"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={eventImages[registration._id] || '/default-image.jpg'}
                    alt={registration.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors">
                    {registration.name}
                  </h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-neutral-500">
                      <Calendar className="w-4 h-4" />
                      <span>{registration.date || 'Date TBA'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-neutral-500">
                      <MapPin className="w-4 h-4" />
                      <span>{registration.location || 'Location TBA'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadTicket(registration)}
                    className="flex items-center space-x-2 w-full justify-center px-4 py-2 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 text-white hover:from-orange-600 hover:to-orange-900 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Ticket</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
