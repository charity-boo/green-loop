// Interface definitions for type safety
interface RewardLevelProps {
  level: string;
  points: string;
  description: string;
}

export default function RewardsProgramPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          💰 Recycling Rewards Program
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Earn **Green Points** every time you recycle correctly. Redeem your points for exclusive discounts, community benefits, and local vouchers!
        </p>

        {/* --- How to Earn Section --- */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-left border border-green-200">
          <h2 className="text-2xl font-semibold text-green-700 mb-5 border-b pb-2">
            How to Earn Green Points
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
            <li>
              **Smart Pickup Completion:** Earn a base amount of points for every scheduled and completed pickup.
            </li>
            <li>
              **Sorting Accuracy Bonus:** Earn **2X points** when the AI confirms your waste is perfectly sorted (recyclables only).
            </li>
            <li>
              **High-Value Materials:** Special bonuses for recycling hard-to-process materials like certain plastics or e-waste.
            </li>
          </ul>
        </div>
        
        {/* --- Redemption Levels Section --- */}
        <div className="mb-10 text-left">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
            Redeem Your Rewards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RewardLevel 
              level="Bronze Tier"
              points="500 Points"
              description="Redeem for a 10% discount voucher at a local eco-friendly store."
            />
            <RewardLevel 
              level="Silver Tier"
              points="1,500 Points"
              description="Get a free month of premium Green Loop tracking and analytics."
            />
            <RewardLevel 
              level="Gold Tier"
              points="5,000 Points"
              description="Donate to a local environmental charity on your behalf, or get a major local discount."
            />
          </div>
        </div>

        {/* --- Call to Action --- */}
        <p className="mt-10 text-md text-gray-700">
          Ready to start earning? <a href="/auth/login" className="text-green-600 font-semibold hover:underline">Log in</a> and schedule your first Smart Waste Pickup today!
        </p>
      </div>
    </div>
  );
}

// Utility Component (Typing applied)
const RewardLevel = ({ level, points, description }: RewardLevelProps) => (
    <div className="p-5 bg-white rounded-lg shadow-md border-t-8 border-green-500 hover:shadow-xl transition duration-300">
        <span className="text-sm font-semibold text-green-700 mb-1 block">{level}</span>
        <h3 className="font-bold text-2xl text-gray-800 mb-2">{points}</h3>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);