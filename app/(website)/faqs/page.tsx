import React from 'react';

const FAQsPage = () => {
  const faqs = [
    {
      question: 'What is Green Loop?',
      answer: 'Green Loop is a community-driven initiative dedicated to promoting sustainable waste management practices, encouraging recycling, and fostering environmental awareness through education and active participation.',
    },
    {
      question: 'How can I participate in Green Loop initiatives?',
      answer: 'There are many ways to get involved! You can join our events and drives, take part in our sustainability challenges, volunteer your time, or simply follow our green tips. Check our "Join the Movement" section for more details.',
    },
    {
      question: 'What types of waste does Green Loop help manage?',
      answer: 'Green Loop focuses on reducing general household and community waste. We provide guidance on recycling common materials like plastics, paper, glass, and metals, and facilitate special drives for e-waste and organic waste composting.',
    },
    {
      question: 'Where can I find recycling centers in my area?',
      answer: 'We recommend checking your local municipal waste management website for the most up-to-date information on recycling centers, accepted materials, and collection schedules in your specific area. Green Loop also organizes specific collection drives which will be advertised on our Events & Drives page.',
    },
    {
      question: 'Does Green Loop offer educational resources for schools?',
      answer: 'Yes, we are passionate about educating the next generation! Our Learning Hub features resources, videos, and guides suitable for various age groups. We also collaborate with schools for workshops and eco-projects. Please contact us for more information on school programs.',
    },
    {
      question: 'How can my business partner with Green Loop?',
      answer: 'We welcome partnerships with businesses that share our vision for a sustainable future. We collaborate on various initiatives, from sponsoring events to implementing eco-friendly practices. Please visit our Partnerships page (or Contact Us) to explore collaboration opportunities.',
    },
    {
      question: 'Is Green Loop a non-profit organization?',
      answer: 'Green Loop operates as a non-profit entity, relying on volunteers, donations, and community support to fund our initiatives and educational programs. Your support helps us make a bigger impact!',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">Frequently Asked Questions</h1>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Q: {faq.question}</h2>
            <p className="text-gray-700 text-lg">A: {faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Still have questions?</h2>
        <p className="text-lg text-gray-700 mb-4">
          If you couldn&apos;t find the answer you were looking for, please don&apos;t hesitate to
          reach out to us directly!
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-colors">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default FAQsPage;