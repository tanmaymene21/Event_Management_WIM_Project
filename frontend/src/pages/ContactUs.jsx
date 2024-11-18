import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import emailjs from 'emailjs-com';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID_CONTACTUS = import.meta.env
  .VITE_EMAILJS_TEMPLATE_ID_CONTACTUS;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

console.log(
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID_CONTACTUS,
  EMAILJS_PUBLIC_KEY,
);

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    console.log(formData);

    try {
      const response = await emailjs.send(
        `${EMAILJS_SERVICE_ID}`, // Your EmailJS Service ID
        `${EMAILJS_TEMPLATE_ID_CONTACTUS}`, // Your EmailJS Template ID
        {
          from_name: formData.name, // Map 'from_name' to 'name'
          from_email: formData.email, // Map 'from_email' to 'email'
          subject: formData.subject, // Map 'subject'
          message: formData.message, // Map 'message'
          to_email: 'tvmene_b22@it.vjti.ac.in', // Include recipient email
        },
        `${EMAILJS_PUBLIC_KEY}`, // Your EmailJS Public Key
      );

      if (response.status === 200) {
        setStatus({
          type: 'success',
          message: 'Thank you for your message! We will get back to you soon.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form fields
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
            Get in Touch
          </h1>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
            Have questions about our event platform? We'd love to hear from you.
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-orange-700/50 rounded-lg text-white"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-orange-700/50 rounded-lg text-white"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-orange-700/50 rounded-lg text-white"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 bg-white/5 border border-orange-700/50 rounded-lg text-white"
              placeholder="Your message here..."
            />
          </div>
          {status.message && (
            <div
              className={`flex items-center space-x-2 ${
                status.type === 'success' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{status.message}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-800 text-white py-3 px-6 rounded-lg flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
