import { prisma } from '../lib/prisma';
async function main() {
    try {
        const collectors = await prisma.user.findMany({
            where: { role: 'COLLECTOR', active: true },
            select: { id: true, name: true }
        });
        console.log(JSON.stringify(collectors, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
