const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'public', 'docs');
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

function createPdf(filename, title, sections) {
    const doc = new PDFDocument({ 
        margin: 50,
        info: {
            Title: title,
            Author: 'Green Loop Waste Management',
        }
    });
    const stream = fs.createWriteStream(path.join(docsDir, filename));
    doc.pipe(stream);

    // Header with Logo Placeholder / Styling
    doc.rect(0, 0, 612, 40).fill('#166534');
    doc.fontSize(10).fillColor('#ffffff').text('GREEN LOOP - SUSTAINABLE NDAGANI', 50, 15, { align: 'center' });

    // Title
    doc.moveDown(4);
    doc.fontSize(28).fillColor('#166534').font('Helvetica-Bold').text(title, { align: 'left' });
    doc.moveDown(1);

    // Add green line
    doc.rect(50, doc.y, 512, 2).fill('#22c55e');
    doc.moveDown(2);

    sections.forEach(section => {
        doc.fontSize(18).fillColor('#14532d').font('Helvetica-Bold').text(section.heading);
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#374151').font('Helvetica').text(section.content, { 
            align: 'justify', 
            lineGap: 3,
            paragraphGap: 10
        });
        
        if (section.list) {
            section.list.forEach(item => {
                doc.fontSize(11).fillColor('#374151').text(`• ${item}`, { 
                    indent: 20,
                    lineGap: 2
                });
            });
            doc.moveDown(1);
        }
        
        doc.moveDown(1);
    });

    // Footer
    const pageCount = doc.bufferedPageRange().count;
    doc.rect(0, 750, 612, 42).fill('#f0fdf4');
    doc.fontSize(9).fillColor('#166534').font('Helvetica-Bold').text('Green Loop Waste Management - Ndagani, Chuka', 50, 765, { align: 'left' });
    doc.fontSize(9).fillColor('#166534').text('Contact: +254 700 000 000 | info@greenloop.co.ke', 50, 780, { align: 'left' });

    doc.end();
}

const householdGuide = [
    {
        heading: 'Introduction to Source Segregation',
        content: 'Source segregation is the practice of dividing waste into different categories at the point of generation. In Ndagani, this simple act ensures that materials like plastics and paper don\'t get contaminated by food waste, making them 100% recyclable. By following this guide, you help Green Loop reduce landfill waste and earn more Green Points for your account.'
    },
    {
        heading: '1. Organic Waste (The Green Bin)',
        content: 'Organic waste accounts for nearly 60% of household waste in Chuka. When properly collected, it becomes high-quality compost for our local farmers.',
        list: [
            'YES: Fruit peels, vegetable scraps, eggshells, coffee grounds, tea bags.',
            'YES: Leftover cooked food (small amounts), wilted flowers, grass clippings.',
            'NO: Plastic bags, glass, metal, diapers, or pet waste.',
            'TIP: Keep your green bin covered to prevent odors and pests.'
        ]
    },
    {
        heading: '2. Recyclables (The Blue Bin)',
        content: 'Clean recyclables are processed into new products. Contamination (like oil or food) can ruin an entire batch.',
        list: [
            'PLASTICS: Rinsed PET bottles (soda/water), HDPE jugs (milk/detergent), clean yogurt tubs.',
            'PAPER: Dry cardboard boxes, newspapers, office paper, envelopes.',
            'METAL: Aluminum beverage cans, clean tin cans.',
            'GLASS: Rinsed glass bottles and jars.',
            'CRITICAL: All items MUST be empty and rinsed of food residue.'
        ]
    },
    {
        heading: '3. General Waste (The Black Bin)',
        content: 'This bin is for items that cannot be recycled or composted currently in our facility.',
        list: [
            'Sanitary products, used diapers, and medical masks.',
            'Heavily soiled food wrappers and greasy pizza boxes.',
            'Broken ceramics and mirrors.',
            'Cigarette butts and floor sweepings.'
        ]
    },
    {
        heading: 'How to Maximize Your Green Points',
        content: 'Green Loop rewards households that maintain low contamination levels. Ensure your blue bin items are dry and your green bin contains only organic matter. Points are awarded upon collection and can be redeemed for local services or mobile money.'
    }
];

const enterpriseGuide = [
    {
        heading: 'Sustainable Business Operations',
        content: 'For businesses in Ndagani—from student hostels to busy restaurants—waste management is not just a regulatory requirement; it is a brand statement. Green Loop partners with enterprises to streamline waste outflow, ensure hygiene, and reduce operational costs through efficient collection.'
    },
    {
        heading: 'Waste Audit & Strategy',
        content: 'Every enterprise is different. We recommend starting with a waste audit to identify your primary waste streams. Most Ndagani hostels produce high volumes of plastic and paper, while restaurants produce massive amounts of organics.',
        list: [
            'Establish dedicated sorting stations with clear Green Loop signage.',
            'Train staff on the difference between recyclables and general waste.',
            'Designate a "Green Champion" to oversee waste compliance.'
        ]
    },
    {
        heading: 'Specific Industry Protocols',
        content: 'Restaurants: Organic waste must be separated in the kitchen. Use sealed Green Loop organic bins to prevent pests. Avoid mixing cooking oil with general waste—ask us about our oil collection partners.',
        list: [
            'Hostels: Provide separate bins on every floor for students.',
            'Retailers: Flatten all cardboard boxes to maximize bin space.',
            'Offices: Focus on paper recycling and e-waste management.'
        ]
    },
    {
        heading: 'Collection Compliance',
        content: 'Enterprise bins must be staged at the designated pickup point by 6:30 AM on your scheduled days (typically Mon/Wed/Fri). Ensure bins are not overfilled and lids are securely closed to maintain Ndagani\'s cleanliness and prevent scavenging.'
    }
];

const compostGuide = [
    {
        heading: 'The Science of Composting',
        content: 'Composting is nature\'s way of recycling. By managing the decomposition of organic matter, we create a nutrient-rich soil amendment that improves soil structure and water retention—vital for the red soils of Chuka.'
    },
    {
        heading: 'The Magic Ratio: Greens vs. Browns',
        content: 'A successful compost pile needs a balance of Nitrogen-rich "Green" materials and Carbon-rich "Brown" materials.',
        list: [
            'GREENS (Nitrogen): Fresh grass, fruit/veg scraps, coffee grounds, green leaves.',
            'BROWNS (Carbon): Dry leaves, straw, shredded plain cardboard, sawdust (from untreated wood).',
            'AIM FOR: 2 parts Browns to 1 part Greens by volume.'
        ]
    },
    {
        heading: 'The Composting Process',
        list: [
            '1. Layering: Start with a layer of browns at the bottom for aeration.',
            '2. Watering: Keep the pile moist, like a wrung-out sponge.',
            '3. Turning: Turn the pile every 10-14 days to introduce oxygen.',
            '4. Maturing: In Chuka\'s climate, compost is usually ready in 3-5 months. It should look like dark, crumbly soil and smell earthy.'
        ]
    },
    {
        heading: 'Common Troubleshooting',
        list: [
            'Bad Smell? Too much moisture or too many greens. Add more browns and turn.',
            'Pests? Avoid adding meat, dairy, or oily foods.',
            'Pile not heating up? Too dry or needs more nitrogen (greens).'
        ]
    }
];

const ewasteGuide = [
    {
        heading: 'The Hidden Dangers of E-Waste',
        content: 'Electronic waste contains toxic heavy metals like lead, mercury, and cadmium. When thrown in general waste, these toxins leach into the ground, potentially contaminating Ndagani\'s water table. Proper disposal is mandatory for environmental safety.'
    },
    {
        heading: 'What Constitutes E-Waste?',
        list: [
            'Mobile phones, chargers, cables, and batteries.',
            'Laptops, keyboards, mice, and monitors.',
            'Small appliances (kettles, irons, blenders).',
            'Power tools and electronic toys.'
        ]
    },
    {
        heading: 'Safe Battery Handling',
        content: 'Batteries are fire hazards and chemical risks. Never crush or burn batteries.',
        list: [
            'Store old batteries in a plastic container away from heat.',
            'Tape the terminals of 9V and Lithium batteries to prevent short circuits.',
            'Hand them over separately to our collectors.'
        ]
    },
    {
        heading: 'Hazardous Chemicals & Medical Waste',
        content: 'Household hazardous waste (HHW) includes items that are corrosive, toxic, or flammable.',
        list: [
            'Paints and Solvents: Never pour down the drain.',
            'Medicines: Do not flush. Return expired meds to our collection point.',
            'Sharps (Needles): Must be placed in a puncture-proof container (like a plastic bottle) before hand-over.'
        ]
    },
    {
        heading: 'Data Security',
        content: 'Before recycling phones or computers, ensure you have performed a factory reset. Green Loop partners with recyclers who follow strict data destruction protocols, but personal responsibility is the first line of defense.'
    }
];

createPdf('household-separation-guide.pdf', 'Household Waste Separation Guide', householdGuide);
createPdf('enterprise-waste-protocol.pdf', 'Enterprise Waste Management Protocol', enterpriseGuide);
createPdf('organic-composting-agriculture.pdf', 'Organic Composting & Agriculture', compostGuide);
createPdf('hazardous-ewaste-manual.pdf', 'Hazardous & E-Waste Safety Manual', ewasteGuide);

console.log('PDFs generated successfully in public/docs/');
