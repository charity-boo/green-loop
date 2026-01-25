"use client";

import Link from "next/link";

// Mock video data
const videoLibrary = [
  {
    id: 1,
    title: "How AI Sorts Your Trash",
    description: "A quick look behind the scenes at our smart sorting facility.",
    duration: "2:45",
    thumbnail: "/images/video_ai.png", // Placeholder image
    link: "#video-1", 
  },
  {
    id: 2,
    title: "Composting 101: Kitchen Scraps",
    description: "Turn your food waste into nutrient-rich soil at home easily.",
    duration: "4:10",
    thumbnail: "/images/video_compost.png", // Placeholder image
    link: "#video-2",
  },
  {
    id: 3,
    title: "Plastic Codes Explained",
    description: "Understanding the numbers on plastic containers and what they mean for recycling.",
    duration: "1:55",
    thumbnail: "/images/video_plastic.png", // Placeholder image
    link: "#video-3",
  },
  {
    id: 4,
    title: "Safe Disposal of Batteries and E-Waste",
    description: "Crucial steps for handling hazardous household items safely.",
    duration: "3:30",
    thumbnail: "/images/video_ewaste.png", // Placeholder image
    link: "#video-4",
  },
];

interface VideoCardProps {
    title: string;
    description: string;
    duration: string;
    thumbnail: string;
    link: string;
}

const VideoCard = ({ title, description, duration, thumbnail, link }: VideoCardProps) => (
    <Link href={link} className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="relative h-48 bg-gray-200">
            {/* Replace with actual Image component if you have the images in /public */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                <span className="text-gray-600 font-semibold text-sm">Video Thumbnail Placeholder</span>
            </div>
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity opacity-0 hover:opacity-100">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v14zm11-7l-6 4V8l6 4z"/>
                </svg>
            </div>
            {/* Duration badge */}
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {duration}
            </span>
        </div>
        <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </Link>
);


export default function EducationalVideosPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-green-800 mb-2 text-center">
                📺 Educational Video Library
            </h1>
            <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
                Watch guides and tutorials on recycling best practices, AI technology, and waste minimization tips.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoLibrary.map(video => (
                    <VideoCard 
                        key={video.id}
                        title={video.title}
                        description={video.description}
                        duration={video.duration}
                        thumbnail={video.thumbnail}
                        link={video.link}
                    />
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link 
                    href="/learning-hub/guides"
                    className="text-green-600 font-semibold hover:underline"
                >
                    ← Back to Recycling Guides
                </Link>
            </div>
        </div>
    </div>
  );
}