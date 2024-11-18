import { CalendarCheck, Ticket, Users, Mail, FileCheck, ClipboardList } from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Create Event", href: "/events/create" },
  { label: "Contact Us", href: "/contact" },
];

export const testimonials = [
  {
    user: "John Doe",
    company: "Stellar Conferences",
    image: user1,
    text: "Organizing our events through this platform was seamless. The ticketing and registration features made everything so much easier!",
  },
  {
    user: "Jane Smith",
    company: "Blue Horizon Events",
    image: user2,
    text: "This platform has revolutionized how we manage our meetups and workshops. The ease of posting and managing attendees is unmatched.",
  },
  {
    user: "David Johnson",
    company: "Quantum Meetups",
    image: user3,
    text: "The real-time ticket generation and confirmation emails saved us a ton of time. Highly recommended for event planners!",
  },
  {
    user: "Ronee Brown",
    company: "Fusion Gatherings",
    image: user4,
    text: "Our attendees loved the smooth registration process. The platform’s features ensured a hassle-free event experience!",
  },
  {
    user: "Michael Wilson",
    company: "Visionary Workshops",
    image: user5,
    text: "With this platform, creating events and managing participants became effortless. The automated emails are a lifesaver!",
  },
  {
    user: "Emily Davis",
    company: "Synergy Conferences",
    image: user6,
    text: "We’ve been using this website for months now, and it’s been a game-changer for managing all our events effectively.",
  },
];

export const features = [
  {
    icon: <CalendarCheck />,
    text: "Create and Post Events",
    description: "Effortlessly create and publish your events for users to explore and register.",
  },
  {
    icon: <Ticket />,
    text: "Instant Ticket Generation",
    description: "Users receive event tickets instantly upon successful registration.",
  },
  {
    icon: <Users />,
    text: "Attendee Management",
    description: "Easily manage and view attendees for all your posted events.",
  },
  {
    icon: <Mail />,
    text: "Automated Confirmation Emails",
    description: "Send confirmation emails automatically when users register for events.",
  },
  {
    icon: <FileCheck />,
    text: "Download Tickets",
    description: "Allow users to download their tickets directly from their dashboard.",
  },
  {
    icon: <ClipboardList />,
    text: "Event Analytics",
    description: "Track event registrations, attendee data, and insights with an integrated dashboard.",
  },
];

export const checklistItems = [
  {
    title: "Seamless Event Creation",
    description: "Quickly create events with all necessary details and publish them instantly.",
  },
  {
    title: "Real-Time Ticket Downloads",
    description: "Allow users to download their tickets immediately after registration.",
  },
  {
    title: "Automated Communication",
    description: "Notify users via email for successful registrations and updates.",
  },
  {
    title: "User-Friendly Interface",
    description: "An intuitive interface ensures smooth navigation for both event organizers and attendees.",
  },
];

export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Create up to 3 Events",
      "Basic Ticketing Features",
      "Standard Email Notifications",
      "Community Support",
    ],
  },
  {
    title: "Pro",
    price: "$15",
    features: [
      "Unlimited Events",
      "Customizable Ticket Designs",
      "Advanced Email Notifications",
      "Priority Support",
    ],
  },
  {
    title: "Enterprise",
    price: "$50",
    features: [
      "Unlimited Events and Features",
      "Dedicated Account Manager",
      "Event Analytics",
      "Custom Integrations",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "How to Create an Event" },
  { href: "#", text: "Ticketing Guide" },
  { href: "#", text: "Event Promotion Tips" },
  { href: "#", text: "API Documentation" },
  { href: "#", text: "FAQs" },
];

export const platformLinks = [
  { href: "#", text: "Features Overview" },
  { href: "#", text: "Supported Ticketing Systems" },
  { href: "#", text: "Terms & Policies" },
  { href: "#", text: "Event Organizer Tools" },
  { href: "#", text: "Version Updates" },
];

export const communityLinks = [
  { href: "#", text: "Event Meetups" },
  { href: "#", text: "Workshops" },
  { href: "#", text: "Community Events" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Networking Opportunities" },
];
