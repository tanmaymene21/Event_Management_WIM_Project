# Event Master - Event Management Platform

<div align="center">
  <img src="frontend/src/assets/logo.png" alt="Event Master Logo" width="200"/>
  <p>A modern event management platform built with React and Node.js</p>
</div>

## 🌟 Features

- Create and manage events seamlessly
- Real-time registration tracking
- Automated email notifications
- QR-coded ticket generation
- User authentication and authorization
- Responsive design for all devices
- Interactive dashboard for event organizers

## 🚀 Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- React Router for navigation
- EmailJS for email notifications
- Unsplash API for dynamic event images
- QR Code generation for tickets
- PDF generation with jsPDF

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## 📦 Installation

1. Clone the repository
```bash
https://github.com/tanmaymene21/Event_Management_WIM_Project.git
cd Event_Management_WIM_Project
```

2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

3. Install Backend Dependencies
```bash
cd backend
npm install
```

4. Environment Setup

Create `.env` files in both frontend and backend directories:

Frontend `.env`:
```env
VITE_API_URL=your_api_url
VITE_UNSPLASH_CLIENTID=your_unsplash_api_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID_REGISTER=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

Backend `.env`:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 🚀 Running the Application

1. Start the Backend Server
```bash
cd backend
npm start
```

2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

## 🎯 Core Functionalities

### Event Creation and Management
- Create and publish events with detailed information
- Manage event attendees and registrations
- Generate QR-coded tickets for registered users

### User Authentication
- Secure signup and login system
- JWT-based authentication
- Protected routes for authenticated users

### Event Registration
- Simple registration process for users
- Automatic email notifications
- Downloadable tickets with QR codes

### Responsive Design
- Mobile-first approach
- Modern UI with TailwindCSS
- Smooth animations and transitions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
