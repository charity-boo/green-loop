// Interface definitions for type safety
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
}

interface StatBoxProps {
  value: string;
  label: string;
}

export default function AISortingInfoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 sm:p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🧠 Our AI-Powered Waste Sorting
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Efficiency meets intelligence. Learn how Green Loop uses computer vision and machine learning to maximize recycling rates.
        </p>

        {/* --- Key Features Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
          <FeatureCard 
            title="Instant Classification"
            description="AI identifies waste types (PET, glass, paper, etc.) in milliseconds."
            icon="⚡"
          />
          <FeatureCard 
            title="99% Accuracy"
            description="Our model is constantly trained to ensure industry-leading sorting precision."
            icon="🎯"
          />
          <FeatureCard 
            title="Reduced Contamination"
            description="Automated sorting removes human error, ensuring a cleaner final material stream."
            icon="✨"
          />
        </div>

        {/* --- Impact and Data Stats (NEW SECTION) --- */}
        <div className="bg-green-700 text-white p-8 rounded-xl shadow-2xl mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Impact, Driven by AI</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatBox value="200K+" label="Items Sorted Daily" />
            <StatBox value="40%" label="Reduction in Landfill Waste" />
            <StatBox value="99%" label="Sorting Accuracy Rate" />
            <StatBox value="30+" label="Material Types Identified" />
          </div>
        </div>

        {/* --- How It Works Section --- */}
        <div className="bg-gray-50 p-8 rounded-xl shadow-lg mb-8 text-left">
          <h2 className="text-2xl font-semibold text-green-700 mb-5 border-b pb-2">
            The Sorting Process
          </h2>
          <ol className="space-y-4 text-gray-700">
            <ProcessStep 
              number={1}
              title="Scanning"
              description="High-resolution cameras capture waste items moving on the conveyor belt."
            />
            <ProcessStep 
              number={2}
              title="AI Analysis"
              description="Our proprietary Machine Learning model analyzes the image for material, color, and shape."
            />
            <ProcessStep 
              number={3}
              title="Separation"
              description="Based on the AI's decision, robotic arms or air jets automatically divert the item to the correct recycling stream."
            />
          </ol>
          
          {/* --- AI Training Explanation (NEW DETAIL) --- */}
          <div className="bg-white p-6 border-l-4 border-green-500 rounded-lg shadow-sm mt-6">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">The Continuous Learning Advantage</h4>
              <p className="text-sm text-gray-600">
                  Our AI system operates on a **continuous feedback loop**. Human operators periodically verify the AI's complex sorting decisions. This verified data is then fed back into the machine learning model, allowing it to rapidly learn new packaging types and improve its classification accuracy every single day, ensuring future-proof waste management.
              </p>
          </div>
        </div>
        
        {/* --- Future Vision (NEW SECTION) --- */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-left">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Beyond Sorting: Smart Data</h3>
            <p className="text-gray-600">
                The data collected by our AI doesn't just sort trash; it provides valuable **waste composition insights** to local governments and businesses. This smart data helps optimize infrastructure, plan recycling campaigns, and ultimately, drive down overall waste generation in the community.
            </p>
        </div>

        {/* --- Call to Action --- */}
        <p className="mt-10 text-md text-gray-700">
          Ready to experience smarter waste management? <a href="/auth/login" className="text-green-600 font-semibold hover:underline">Log in or Register</a> to schedule your first Smart Waste Pickup!
        </p>
      </div>
    </div>
  );
}

// Utility Components (Typing applied)
const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition duration-300">
        <div className="text-3xl mb-2">{icon}</div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);

const ProcessStep = ({ number, title, description }: ProcessStepProps) => (
    <li className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white font-bold text-sm">
            {number}
        </div>
        <div>
            <h4 className="font-semibold text-lg text-gray-800">{title}</h4>
            <p className="text-gray-600">{description}</p>
        </div>
    </li>
);

const StatBox = ({ value, label }: StatBoxProps) => (
    <div className="text-center">
        <p className="text-4xl font-extrabold">{value}</p>
        <p className="text-sm font-light uppercase tracking-widest mt-1 opacity-80">{label}</p>
    </div>
);