import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

async function main() {
    console.log('Seeding collectors for performance table test...');

    const collectors = [
        { name: 'Bob', email: 'bob@greenloop.com' },
        { name: 'Alice', email: 'alice@greenloop.com' },
        { name: 'Charlie', email: 'charlie@greenloop.com' },
        { name: 'Dave', email: 'dave@greenloop.com' },
    ];

    for (const c of collectors) {
        await prisma.user.upsert({
            where: { email: c.email },
            update: { name: c.name, role: Role.COLLECTOR, active: true },
            create: {
                email: c.email,
                name: c.name,
                role: Role.COLLECTOR,
                active: true,
            },
        });
    }

    console.log('Collectors seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
