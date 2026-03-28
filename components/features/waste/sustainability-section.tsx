import React from 'react';

const SustainabilitySection = () => {
  return (
    <section className="bg-background py-16 transition-colors">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8 transition-colors">
          Our Commitment to Environmental Sustainability
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12 transition-colors">
          We are dedicated to making a positive impact on the environment through our innovative waste management solutions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-muted/50 dark:bg-accent/10 p-8 rounded-lg transition-colors">
            <h3 className="text-xl font-bold text-foreground mb-4 transition-colors">CO2 Reduction</h3>
            <p className="text-muted-foreground transition-colors">
              Our optimized collection routes and advanced recycling processes significantly reduce carbon emissions.
            </p>
          </div>
          <div className="bg-muted/50 dark:bg-accent/10 p-8 rounded-lg transition-colors">
            <h3 className="text-xl font-bold text-foreground mb-4 transition-colors">Landfill Diversion</h3>
            <p className="text-muted-foreground transition-colors">
              We divert a significant amount of waste from landfills, promoting a circular economy and preserving natural resources.
            </p>
          </div>
          <div className="bg-muted/50 dark:bg-accent/10 p-8 rounded-lg transition-colors">
            <h3 className="text-xl font-bold text-foreground mb-4 transition-colors">Resource Conservation</h3>
            <p className="text-muted-foreground transition-colors">
              By recycling and reusing materials, we conserve valuable resources and reduce the need for new raw materials.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
