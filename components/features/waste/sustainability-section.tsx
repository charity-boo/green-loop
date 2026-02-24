import React from 'react';

const SustainabilitySection = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Our Commitment to Environmental Sustainability
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12">
          We are dedicated to making a positive impact on the environment through our innovative waste management solutions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">CO2 Reduction</h3>
            <p className="text-gray-600">
              Our optimized collection routes and advanced recycling processes significantly reduce carbon emissions.
            </p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Landfill Diversion</h3>
            <p className="text-gray-600">
              We divert a significant amount of waste from landfills, promoting a circular economy and preserving natural resources.
            </p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resource Conservation</h3>
            <p className="text-gray-600">
              By recycling and reusing materials, we conserve valuable resources and reduce the need for new raw materials.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
