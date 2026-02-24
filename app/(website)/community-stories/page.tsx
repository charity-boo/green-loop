import React from 'react';

const CommunityStoriesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-green-800 mb-6">Inspiring Community Stories</h1>
      <p className="text-lg text-gray-700 mb-6">
        Discover heartwarming and inspiring stories from individuals and communities who are making a
        real difference in promoting sustainability and waste reduction. Their efforts showcase the
        power of collective action!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Story 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-semibold text-green-700 mb-3">
            The &quot;Zero-Waste Heroes&quot; of Willow Creek
          </h2>
          <p className="text-gray-600 mb-4 flex-grow">
            Meet the residents of Willow Creek, a small town that embarked on an ambitious journey to
            become a zero-waste community. Through innovative composting programs, local exchange
            markets, and extensive public education, they&apos;ve reduced landfill waste by an
            astonishing 70% in just two years. Their story is a testament to what dedicated neighbors
            can achieve together.
          </p>
          <span className="text-sm text-gray-500 italic">— Featured in EcoWeekly Magazine</span>
        </div>

        {/* Story 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-semibold text-green-700 mb-3">
            Maria&apos;s Upcycling Workshop
          </h2>
          <p className="text-gray-600 mb-4 flex-grow">
            Maria, a retired art teacher, transformed her garage into a vibrant upcycling workshop for
            local youth. She teaches kids how to turn discarded materials like plastic bottles, old
            tires, and fabric scraps into beautiful and functional art pieces. Her workshops not only
            divert waste but also foster creativity and environmental awareness among the younger
            generation.
          </p>
          <span className="text-sm text-gray-500 italic">— Local Hero Award Winner 2023</span>
        </div>

        {/* Story 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-semibold text-green-700 mb-3">
            The Community Garden Initiative
          </h2>
          <p className="text-gray-600 mb-4 flex-grow">
            A group of urban dwellers transformed an abandoned lot into a thriving community garden.
            Utilizing rainwater harvesting and organic composting techniques, they grow fresh produce
            for local food banks. This initiative not only provides healthy food but also strengthens
            community bonds and educates participants on sustainable agriculture.
          </p>
          <span className="text-sm text-gray-500 italic">— Supported by Green Loop Foundation</span>
        </div>

        {/* Story 4 */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-semibold text-green-700 mb-3">
            Local Business Goes Green
          </h2>
          <p className="text-gray-600 mb-4 flex-grow">
            &quot;The Daily Grind&quot; coffee shop implemented a comprehensive sustainability plan,
            including biodegradable packaging, composting coffee grounds, and offering discounts for
            reusable cups. Their commitment inspired other local businesses to adopt similar
            eco-friendly practices, creating a greener business district.
          </p>
          <span className="text-sm text-gray-500 italic">— Green Business Certification</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xl font-semibold text-green-800">
          Have a story to share? We&apos;d love to hear how you&apos;re contributing to a sustainable future!
        </p>
      </div>
    </div>
  );
};

export default CommunityStoriesPage;