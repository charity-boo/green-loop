import React from 'react';
import Image from 'next/image';

const EventsDrivesPage = () => {
  const events = [
    {
      id: 1,
      title: 'Annual River Cleanup Day',
      date: 'Saturday, April 22, 2026',
      time: '9:00 AM - 1:00 PM',
      location: 'Riverside Park, Meeting Point: Main Entrance',
      description: 'Join us for our biggest annual event to clean up the Green River. Volunteers will help remove litter and restore the natural beauty of the riverbanks. Gloves and bags provided. Lunch will be served for all participants.',
      image: '/images/river-cleanup.jpg', // Placeholder image
    },
    {
      id: 2,
      title: 'Electronics Recycling Drive',
      date: 'Saturday, May 13, 2026',
      time: '10:00 AM - 3:00 PM',
      location: 'Community Center Parking Lot',
      description: 'Dispose of your old electronics responsibly! We are collecting old computers, phones, TVs, and other e-waste for safe and eco-friendly recycling. Help prevent harmful materials from entering landfills.',
      image: '/images/electronics-recycling.jpg', // Placeholder image
    },
    {
      id: 3,
      title: 'Composting Workshop for Beginners',
      date: 'Sunday, June 4, 2026',
      time: '11:00 AM - 12:30 PM',
      location: 'Botanical Garden Conservatory',
      description: 'Learn the basics of home composting! This workshop will cover different composting methods, what materials to compost, and how to use your compost to enrich your garden soil. Hands-on demonstrations included.',
      image: '/images/compost-workshop.jpg', // Placeholder image
    },
    {
      id: 4,
      title: 'Sustainable Living Fair',
      date: 'Saturday & Sunday, July 15-16, 2026',
      time: '10:00 AM - 5:00 PM (both days)',
      location: 'Exhibition Hall, Booths 1-50',
      description: 'Explore innovative sustainable products, technologies, and services. Featuring local eco-friendly businesses, expert speakers, and interactive workshops on topics like renewable energy, zero-waste living, and ethical consumption.',
      image: '/images/sustainability-fair.jpg', // Placeholder image
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-green-800 mb-6">Upcoming Events & Drives</h1>
      <p className="text-lg text-gray-700 mb-8">
        Join Green Loop in our efforts to foster a sustainable community! Check out our upcoming
        events and drives designed to educate, engage, and empower individuals to make a positive
        environmental impact.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {event.image && (
              <div className="relative w-full h-48">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-green-700 mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-1">
                <strong className="text-green-700">Date:</strong> {event.date}
              </p>
              <p className="text-gray-600 mb-1">
                <strong className="text-green-700">Time:</strong> {event.time}
              </p>
              <p className="text-gray-600 mb-4">
                <strong className="text-green-700">Location:</strong> {event.location}
              </p>
              <p className="text-gray-700">{event.description}</p>
              <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition-colors">
                Register / Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Host Your Own Drive!</h2>
        <p className="text-lg text-gray-700 mb-4">
          Interested in organizing a cleanup, recycling drive, or educational event in your
          community? Green Loop provides resources and support to help you make it a success.
        </p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 px-6 rounded-full transition-colors">
          Get Started Here
        </button>
      </div>
    </div>
  );
};

export default EventsDrivesPage;