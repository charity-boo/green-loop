export default function CareersPage() {
  const jobListings = [
    { title: "AI/ML Engineer", location: "Ndagani Tech Hub", type: "Full-time" },
    { title: "Waste Logistics Coordinator", location: "Field Operations", type: "Full-time" },
    { title: "Community Outreach Specialist", location: "Ndagani", type: "Part-time" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4 sm:p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">
          🚀 Careers at Green Loop
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Join a team dedicated to innovation, sustainability, and making a difference in the community.
        </p>

        {/* --- Job Listings --- */}
        <div className="space-y-4 text-left">
          {jobListings.map((job, index) => (
            <div key={index} className="p-5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition shadow-sm">
              <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {job.location} | {job.type}
              </p>
              <a href="#apply" className="text-blue-600 font-semibold text-sm mt-2 inline-block hover:underline">
                Apply Now →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl">
            <p className="text-lg font-medium text-blue-700">
                Don't see a fit? Send your CV to <a href="mailto:careers@greenloop.com" className="hover:underline">careers@greenloop.com</a>
            </p>
        </div>
      </div>
    </div>
  );
}