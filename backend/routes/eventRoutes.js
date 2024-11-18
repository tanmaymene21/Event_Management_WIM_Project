const express = require('express');
const { createEvent, getEvents, registerEvent, getUserRegistrations, getMyCreatedEvents, getEventAttendees, getEvent } = require('../controllers/eventController');
const protect = require('../middleware/authMiddleware'); 
const router = express.Router();

// Place specific routes before parameterized routes
router.get('/myregistrations', protect, getUserRegistrations);
router.get('/mycreatedevents', protect, getMyCreatedEvents);

// Then place the routes with parameters
router.get('/', getEvents);
router.post('/create', protect, createEvent);
router.get('/:eventId', protect, getEvent);
router.post('/:eventId/register', protect, registerEvent);
router.get('/:eventId/attendees', protect, getEventAttendees);

module.exports = router;
