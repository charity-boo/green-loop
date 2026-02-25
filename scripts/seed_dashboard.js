const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // Clean up existing data to start fresh (optional but good for specific stress test)
    // await prisma.aIAnalysis.deleteMany();
    // await prisma.schedule.deleteMany();

    // Create test users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@greenloop.com' },
        update: { role: 'ADMIN' },
        create: {
            email: 'admin@greenloop.com',
            name: 'Admin User',
            role: 'ADMIN',
        },
    });

    const collector1 = await prisma.user.upsert({
        where: { email: 'collector1@greenloop.com' },
        update: { role: 'COLLECTOR', active: true },
        create: {
            email: 'collector1@greenloop.com',
            name: 'Collector One',
            role: 'COLLECTOR',
            active: true,
        },
    });

    const collector2 = await prisma.user.upsert({
        where: { email: 'collector2@greenloop.com' },
        update: { role: 'COLLECTOR', active: true },
        create: {
            email: 'collector2@greenloop.com',
            name: 'Collector Two',
            role: 'COLLECTOR',
            active: true,
        },
    });

    const testUser = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: { role: 'USER' },
        create: {
            email: 'user@example.com',
            name: 'Test User',
            role: 'USER',
        },
    });

    // 1. Stress Test: 20 schedules with different statuses and dates
    const statuses = ['PENDING', 'COMPLETED', 'MISSED'];
    const wasteTypes = ['Plastic', 'Paper', 'Glass', 'Organic'];

    for (let i = 0; i < 20; i++) {
        // Distribute across -10 to +10 days from now
        const date = new Date();
        date.setDate(date.getDate() + (i - 10));

        await prisma.schedule.create({
            data: {
                userId: testUser.id,
                // collector2 gets 0 assignments (requested)
                collectorId: i % 2 === 0 ? collector1.id : null,
                date: date,
                status: statuses[i % 3],
                wasteVolume: Math.random() * 50 + 5,
                wasteType: wasteTypes[i % 4],
            },
        });
    }

    // 2. Stress Test: some AIAnalysis entries
    for (let i = 0; i < 15; i++) {
        await prisma.aIAnalysis.create({
            data: {
                userId: testUser.id,
                // Mix of true/false
                isCorrect: i % 3 !== 0,
            },
        });
    }

    console.log('Seed data created successfully:');
    console.log('- 1 Admin');
    console.log('- 2 Collectors (one with 0 assignments)');
    console.log('- 1 User');
    console.log('- 20 Schedules');
    console.log('- 15 AI Analyses');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
