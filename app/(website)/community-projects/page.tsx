// Interface definitions for type safety
interface InitiativeCardProps {
  title: string;
  description: string;
  focus: string; // e.g., 'Education', 'Cleanup', 'Collection'
}

export default function CommunityProjectsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4 sm:p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🧑‍🤝‍🧑 Community Engagement
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Green Loop is more than just technology; we empower students, collectors, and communities to drive local change and participate in a circular economy.
        </p>

        {/* --- Initiatives Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
          <InitiativeCard 
            title="School Education Programs"
            description="Interactive workshops and challenges to teach students the value of recycling and waste reduction from a young age."
            focus="Education"
          />
          <InitiativeCard 
            title="Local Clean-Up Drives"
            description="Regular organized events where community members and Green Loop volunteers work together to clean public spaces."
            focus="Cleanup"
          />
          <InitiativeCard 
            title="Collector Empowerment"
            description="Providing training, safety gear, and fair compensation to local waste collectors, integrating them into our digital network."
            focus="Empowerment"
          />
        </div>

        {/* --- Get Involved Section --- */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-left">
          <h2 className="text-2xl font-semibold text-green-700 mb-5 border-b pb-2">
            How to Get Involved
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
            <li>
              **Volunteer:** Sign up for the next clean-up event in your area.
            </li>
            <li>
              **Sponsor:** Businesses can sponsor school programs or collector initiatives.
            </li>
            <li>
              **Suggest:** Use our app to report areas needing attention or propose new engagement ideas.
            </li>
          </ul>
        </div>
        
        {/* --- Call to Action --- */}
        <p className="mt-10 text-md text-gray-700">
          Want to earn rewards while you recycle? Check out our <a href="/rewards-program" className="text-green-600 font-semibold hover:underline">Recycling Rewards Program</a>!
        </p>
      </div>
    </div>
  );
}

// Utility Component (Typing applied)
const InitiativeCard = ({ title, description, focus }: InitiativeCardProps) => (
    <div className="p-5 bg-white border-t-4 border-green-500 rounded-lg shadow-md hover:shadow-xl transition duration-300">
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 
            ${focus === 'Education' ? 'bg-blue-100 text-blue-800' : 
              focus === 'Cleanup' ? 'bg-yellow-100 text-yellow-800' :
              'bg-purple-100 text-purple-800'
            }`
        }>
            {focus}
        </span>
        <h3 className="font-bold text-xl mb-2 text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);