import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import RegisterForEvent from './pages/RegisterForEvent';
import MyEvents from './pages/MyEvents';
import MyRegistrations from './pages/MyRegistrations';
import Attendees from './pages/Attendees';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import { useAuth } from './context/AuthContext';
import Footer from './components/Footer';
import ContactUs from './pages/ContactUS';

function App() {
  const { user, loading } = useAuth(); // Get user data and loading state from context

  if (loading) {
    return <div>Loading...</div>; // Optionally, you can show a loading spinner or message while loading
  }

  const isAuthenticated = user ? true : false;

  return (
    <Router>
      <div className="App text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Protect the "Create Event", "Register for Event", and "Attendees" routes */}
          <Route
            path="/events/create"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/register"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <RegisterForEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/attendees"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Attendees />
              </ProtectedRoute>
            }
          />

          {/* Protect the "My Events" and "My Registrations" routes */}
          <Route
            path="/myevents"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MyEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myregistrations"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
