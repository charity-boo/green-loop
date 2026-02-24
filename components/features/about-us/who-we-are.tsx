"use client";

import React from "react";
import Image from "next/image";

const AboutUsPage = () => {
  return (
    <>
      <section className="space-y-24 p-8 bg-gray-50">
        {/* 1️⃣ Who We Are */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image on the left */}
          <div className="relative">
            <Image
              src="/images/whoweare.png"
              alt="Community Cleanup"
              width={600}
              height={400}
              className="rounded-2xl shadow-lg w-full"
            />
          </div>

          {/* Text on the right */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed">
              We are <strong>Green Loop</strong>, an environmental solutions organization
              committed to transforming waste into value. Our focus is to create a
              cleaner, greener future for Ndagani and its neighboring regions by managing
              waste from collection to safe, sustainable disposal.
            </p>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Through innovation and community involvement, we turn waste into resources,
              promote circular economy practices, and contribute to environmental
              conservation and public health improvement.
            </p>
          </div>
        </div>

        {/* 2️⃣ What We Believe In */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              What We Believe In
            </h2>
          </div>
          <div>
            <p className="text-gray-700 leading-relaxed">
              We believe sustainability is more than just managing waste — it{'\''}s about
              building a responsible future. Our beliefs are rooted in innovation, care
              for the environment, and empowering communities to take part in
              environmental conservation.
            </p>
            <p className="text-gray-700 mt-4 leading-relaxed">
              By fostering collaboration between technology, education, and social
              awareness, we aim to create lasting environmental change that benefits
              everyone — from individuals to entire communities.
            </p>
          </div>
        </div>

        {/* 3️⃣ Mission & Vision Side by Side */}
        <div className="grid md:grid-cols-2 gap-10 text-center">
          {/* Mission */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <Image
              src="/images/ourmision.png"
              alt="Our Mission"
              width={600}
              height={400}
              className="w-full h-[300px] object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to provide reliable and sustainable waste management
                solutions that reduce environmental impact, enhance recycling rates,
                and foster healthier communities.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <Image
              src="/images/vision.png"
              alt="Our Vision"
              width={600}
              height={400}
              className="w-full h-[300px] object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To lead in circular economy innovation, inspiring sustainable cities
                through eco-smart technology, responsible recycling, and community-driven
                environmental action.
              </p>
            </div>
          </div>
        </div>

        {/* 4️⃣ Our Corporate Strategy */}
        <div className="flex flex-col lg:flex-row items-center max-w-6xl mx-auto border-t border-gray-200 pt-12 space-y-8 lg:space-y-0 lg:space-x-12">
          <div className="lg:w-1/3 text-green-800 font-bold text-2xl text-left">
            Our Corporate Strategy
          </div>
          <div className="lg:w-2/3 text-gray-700 leading-relaxed text-left">
            Green Loop{'\''}s corporate strategy focuses on transforming waste management through
            technology, sustainability, and community collaboration. We aim to create cleaner,
            healthier, and more sustainable communities by integrating innovation into every
            stage of waste handling — from collection and processing to recycling and data-driven
            environmental insights.
            <br /><br />
            Guided by our vision to become the leading smart waste management and sustainability
            solutions provider, we prioritize digital innovation, operational excellence, and
            community impact while engaging the public in responsible waste management and
            environmental education.
          </div>
        </div>

        {/* 5️⃣ Our Core Values */}
        <div className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="absolute top-0 left-0 h-full w-full opacity-30 bg-blue-50/50 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row border-l-2 border-green-300">
            <div className="lg:w-1/3 p-6 lg:p-12 relative z-10">
              <div className="lg:pr-10">
                <div className="absolute -top-4 -left-4 w-4 h-4 rounded-full bg-green-500 opacity-80"></div>
                <h2 className="text-5xl font-extrabold text-green-900 mb-6 leading-tight">
                  Our Core Values
                </h2>
                <p className="text-xl font-medium text-green-900">
                  Service is at the heart of what we do
                </p>
              </div>
            </div>
            <div className="lg:w-2/3 p-6 lg:p-12 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-10">
                {[
                  "We put our customers first as they matter most",
                  "We work together as one team to achieve our goals",
                  "We are passionate about powering the nation",
                  "We believe in integrity and delivering on our promises",
                  "We strive for excellence in all that we do",
                  "We are accountable to our customers and stakeholders"
                ].map((value, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="mb-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-base font-medium text-green-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6️⃣ Our Commitment & Quality Policy */}
        {/* 5️⃣ Our Commitment & Quality Policy */}
        <div className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="absolute top-0 left-0 h-full w-full opacity-10 bg-green-50 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start border-l-2 border-green-300">

            {/* Left: Heading + Image */}
            <div className="lg:w-1/2 mb-8 lg:mb-0 flex flex-col items-center lg:items-start">
              {/* Heading */}
              <h2 className="text-4xl font-extrabold text-green-800 mb-6 leading-tight text-center lg:text-left">
                Our Commitment & Quality Policy
              </h2>

              {/* Image below heading */}
              <Image
                src="/images/policy.png" // Replace with your actual image path
                alt="Commitment & Quality"
                width={500}
                height={350}
                className="rounded-2xl shadow-lg w-full object-cover"
              />
            </div>

            {/* Right: Text */}
            <div className="lg:w-1/2 lg:pl-12 text-gray-700 leading-relaxed">
              <p className="text-lg mb-4">
                We are committed to providing <strong>cost-effective, reliable, and high-quality environmental solutions</strong> that improve the cleanliness, health, and sustainability of our communities. Our quality objectives are aligned with our Corporate Strategy and implemented across all operations, teams, and processes.
              </p>
              <p className="text-lg mb-4">
                Management and staff remain dedicated to the effective execution and continuous improvement of our practices, ensuring compliance with best practices and environmental standards.
              </p>
            </div>
          </div>

          {/* Commitment Cards (full width under image + text) */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-7xl mx-auto">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-green-700 font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                We prioritize landfill diversion, invest in technology to increase recycling rates, and embrace innovative waste management solutions.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-green-700 font-semibold mb-2">Safety</h3>
              <p className="text-gray-600 text-sm">
                The health and safety of our employees and the public are paramount, guided by rigorous standards and protocols.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-green-700 font-semibold mb-2">Community</h3>
              <p className="text-gray-600 text-sm">
                We support environmental education, local clean-up initiatives, and community engagement programs to make a positive impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7️⃣ Footer */}
    </>
  );
};

export default AboutUsPage;
