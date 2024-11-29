const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Browse all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'username');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving events' });
  }
};

// get a particular event
exports.getEvent = async (req, res) => {
  try {
    const { eventId } = req.params; // Get the event ID from the route parameters

    // Find the events created by the logged-in user
    const events = await Event.find({ createdBy: req.user._id });

    // Check if the event exists in the list of events created by the user
    const event = events.find((e) => e._id.toString() === eventId);

    if (event) {
      // If the event exists in the user's events, return an error
      return res.status(400).json({ message: 'This event is created by you' });
    }

    // If event is not found, fetch it by its ID
    const eventFromDb = await Event.findById(eventId);

    if (!eventFromDb) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(eventFromDb); // Return the event data as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving event' });
  }
};


// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    const event = await Event.create({
      name,
      description,
      date,
      location,
      createdBy: req.user._id,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
};

// Register the logged-in user for an event
exports.registerEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if the user is already registered
    const existingRegistration = await Registration.findOne({ event: eventId, user: req.user._id });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Register the user
    const registration = await Registration.create({
      event: eventId,
      user: req.user._id,
    });

    // Add user to event's attendees list
    await Event.findByIdAndUpdate(eventId, { $push: { attendees: req.user._id } });

    res.status(201).json({ message: 'Registration successful', registration });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for the event' });
  }
};

// Get all events created by the logged-in user
exports.getMyCreatedEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user-created events' });
  }
};

// Get all events the logged-in user has registered for
exports.getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate({
        path: 'event',
        select: 'name description date location' // specify fields you want to retrieve
      });

    if (!registrations) {
      return res.status(404).json({ message: 'No registrations found' });
    }

    const registeredEvents = registrations.map(registration => registration.event);
    res.json(registeredEvents);
  } catch (error) {
    console.error('Registration error:', error); // Add this for debugging
    res.status(500).json({ message: 'Error retrieving registered events' });
  }
};

// Get attendees for a specific event created by the logged-in user
exports.getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Verify the event was created by the logged-in user
    const event = await Event.findOne({ _id: eventId, createdBy: req.user._id }).populate('attendees', 'username email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found or not authorized to view attendees' });
    }

    res.json(event.attendees);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving event attendees' });
  }
};
