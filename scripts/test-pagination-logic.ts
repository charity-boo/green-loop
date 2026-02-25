import { getCollectorPerformance } from '../lib/admin/analytics';

async function test() {
    console.log('Testing getCollectorPerformance...');

    // Test Page 1
    const p1 = await getCollectorPerformance({ page: 1, limit: 2 });
    console.log('Page 1:', p1.data.map(c => c.name));

    // Test Page 2
    const p2 = await getCollectorPerformance({ page: 2, limit: 2 });
    console.log('Page 2:', p2.data.map(c => c.name));

    // Test Clamp logic (backend)
    const pClamp = await getCollectorPerformance({ page: -5, limit: 2 });
    console.log('Clamp -5 -> Page 1:', pClamp.page === 1);

    // Test Empty Page
    const pEmpty = await getCollectorPerformance({ page: 999, limit: 2 });
    console.log('Page 999 Data Length:', pEmpty.data.length);
}

test().catch(console.error);
