import React from 'react';
import Image from 'next/image';

const ChallengesPage = () => {
  const challenges = [
    {
      id: 1,
      title: '30-Day Zero Waste Challenge',
      description: 'Commit to reducing your waste to an absolute minimum for 30 days. We provide daily tips, resources, and a supportive community to help you succeed in minimizing your ecological footprint.',
      difficulty: 'Intermediate',
      reward: 'Digital Certificate & Community Recognition',
      image: '/images/zero-waste-challenge.jpg', // Placeholder
    },
    {
      id: 2,
      title: 'Plastic-Free July Pledge',
      description: 'Join millions worldwide in avoiding single-use plastics for the entire month of July. Learn easy swaps and discover sustainable alternatives that can become lifelong habits.',
      difficulty: 'Beginner',
      reward: 'Exclusive Green Loop Reusable Bag',
      image: '/images/plastic-free-challenge.jpg', // Placeholder
    },
    {
      id: 3,
      title: 'Green Commute Week',
      description: 'Challenge yourself to use sustainable transportation (walking, biking, public transport, carpooling) for your daily commute for one week. Track your impact and inspire others to join in.',
      difficulty: 'Beginner',
      reward: 'Entry into our Eco-Gadget Raffle',
      image: '/images/commute-challenge.jpg', // Placeholder
    },
    {
      id: 4,
      title: 'Community Garden Grow-Off',
      description: 'Participate in our friendly competition to grow the most vibrant and productive community garden plot. Share tips, learn from experts, and contribute to local food security.',
      difficulty: 'Intermediate',
      reward: 'Gardening Kit & Local Produce Voucher',
      image: '/images/garden-challenge.jpg', // Placeholder
    },
    {
      id: 5,
      title: 'Energy Saving Home Audit',
      description: 'Conduct a thorough energy audit of your home. Identify areas for improvement, implement energy-saving measures, and share your success with the Green Loop community.',
      difficulty: 'Advanced',
      reward: 'Smart Home Energy Monitor',
      image: '/images/energy-challenge.jpg', // Placeholder
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-green-800 mb-6">Green Loop Challenges</h1>
      <p className="text-lg text-gray-700 mb-8">
        Ready to take your commitment to sustainability to the next level? Our challenges are designed
        to inspire, educate, and empower you to adopt eco-friendly habits and make a tangible impact.
        Join a challenge today and become part of a movement for a greener future!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            {challenge.image && (
              <Image src={challenge.image} alt={challenge.title} className="w-full h-48 object-cover" width={400} height={192} />
            )}
            <div className="p-6 flex-grow flex flex-col">
              <h2 className="text-2xl font-semibold text-green-700 mb-2">{challenge.title}</h2>
              <p className="text-gray-600 mb-4 flex-grow">{challenge.description}</p>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Difficulty: {challenge.difficulty}
                </span>
                <span className="text-gray-500">Reward: {challenge.reward}</span>
              </div>
              <button className="mt-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition-colors">
                Join Challenge
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Propose a New Challenge!</h2>
        <p className="text-lg text-gray-700 mb-4">
          Have an idea for a fun and impactful sustainability challenge? We&apos;d love to hear it!
          Submit your idea and help us grow our community initiatives.
        </p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 px-6 rounded-full transition-colors">
          Submit Your Idea
        </button>
      </div>
    </div>
  );
};

export default ChallengesPage;