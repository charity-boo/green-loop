"use client";

import Image from "next/image";

const SafetyAndCompliance = () => {
  return (
    <section className="space-y-24 p-8 bg-muted/50">
      {/* 1️⃣ Safety Overview */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Image on the left */}
        <div className="relative">
          <Image
            src="/images/safety.jpg" // Replace with actual image path
            alt="Safety at Green Loop"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg w-full"
          />
        </div>

        {/* Text on the right */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Safety & Compliance</h2>
          <p className="text-gray-700 leading-relaxed">
            At <strong>Green Loop</strong>, safety is our top priority. We implement strict safety measures 
            to protect our employees, the communities we serve, and the environment. Our operations are 
            designed to prevent accidents, reduce exposure to hazardous waste, and promote a culture of safety.
          </p>
          <p className="text-gray-700 mt-4 leading-relaxed">
            Compliance with environmental regulations and local laws is embedded into all our processes. 
            From collection and sorting to recycling and disposal, every step is monitored to meet regulatory 
            standards and industry best practices.
          </p>
        </div>
      </div>

      {/* 2️⃣ Safety & Compliance Details */}
      <div className="grid md:grid-cols-2 gap-10 items-start mt-16">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-green-800">Employee Safety</h3>
          <p className="text-gray-700 leading-relaxed">
            We provide protective equipment, comprehensive training, and safety protocols for all staff 
            involved in waste collection, processing, and recycling operations.
          </p>

          <h3 className="text-2xl font-bold text-green-800">Community Safety</h3>
          <p className="text-gray-700 leading-relaxed">
            Green Loop ensures that communities are never exposed to hazardous materials. 
            Safe collection points and secure disposal methods protect residents and local ecosystems.
          </p>

          <h3 className="text-2xl font-bold text-green-800">Operational Compliance</h3>
          <p className="text-gray-700 leading-relaxed">
            All processes adhere to Kenyan environmental regulations, industry standards, 
            and continuous monitoring ensures we maintain compliance at every stage.
          </p>
        </div>

        {/* Right Image */}
        <div className="relative">
          <Image
            src="/images/compliance.jpg" // Replace with actual image path
            alt="Compliance at Green Loop"
            width={500}
            height={400}
            className="rounded-2xl shadow-lg w-full"
          />
        </div>
      </div>

      {/* 3️⃣ Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-7xl mx-auto">
        <div className="bg-card shadow-lg rounded-xl p-6 text-center">
          <h3 className="text-green-700 font-semibold mb-2">Safety</h3>
          <p className="text-muted-foreground text-sm">
            Strict safety protocols for employees and communities ensure risk-free operations.
          </p>
        </div>
        <div className="bg-card shadow-lg rounded-xl p-6 text-center">
          <h3 className="text-green-700 font-semibold mb-2">Compliance</h3>
          <p className="text-muted-foreground text-sm">
            Adherence to Kenyan environmental regulations and international best practices.
          </p>
        </div>
        <div className="bg-card shadow-lg rounded-xl p-6 text-center">
          <h3 className="text-green-700 font-semibold mb-2">Monitoring</h3>
          <p className="text-muted-foreground text-sm">
            Continuous audits and oversight maintain high standards and ensure accountability.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SafetyAndCompliance;
