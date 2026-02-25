import 'dotenv/config';
import { getCollectorPerformance } from '../lib/admin/analytics';
import { subDays } from 'date-fns';

async function runTests() {
    console.log('🚀 Starting Collector Performance SQL Verification...\n');

    try {
        // Case 1: Default Window (Last 30 Days)
        console.log('--- Case 1: Default (Last 30 Days) ---');
        const defaultRes = await getCollectorPerformance({});
        console.log(`Summary: Total ${defaultRes.total}, Data Length: ${defaultRes.data.length}`);
        if (defaultRes.data.length > 0) {
            console.table(defaultRes.data.slice(0, 5));
        } else {
            console.log('No data found for default window.');
        }

        // Case 2: Very Narrow Window (Last 1 Day)
        console.log('\n--- Case 2: Narrow Window (Last 1 Day) ---');
        const narrowRes = await getCollectorPerformance({
            startDate: subDays(new Date(), 1)
        });
        console.log(`Summary: Total ${narrowRes.total}, Data Length: ${narrowRes.data.length}`);
        // Idle collectors should still be here with 0s
        const idleCount = narrowRes.data.filter(d => d.assigned === 0).length;
        console.log(`Collectors with 0 assignments: ${idleCount}/${narrowRes.data.length}`);

        // Case 3: Lifetime Window
        console.log('\n--- Case 3: Lifetime Window ---');
        const lifetimeRes = await getCollectorPerformance({
            startDate: new Date('2000-01-01')
        });
        console.log(`Summary: Total ${lifetimeRes.total}, Data Length: ${lifetimeRes.data.length}`);
        if (lifetimeRes.data.length > 0) {
            console.table(lifetimeRes.data.slice(0, 3));
        }

        // Case 4: Sorting Validation (Missed ASC)
        console.log('\n--- Case 4: Sorting (Missed ASC) ---');
        const sortRes = await getCollectorPerformance({
            sortBy: 'missed',
            sortOrder: 'asc',
            limit: 5
        });
        console.table(sortRes.data);

        // Case 5: Pagination Boundaries
        console.log('\n--- Case 5: Pagination (Page 2) ---');
        const page2Res = await getCollectorPerformance({
            page: 2,
            limit: 2
        });
        console.log(`Page 2 Result Count: ${page2Res.data.length}`);

        console.log('\n✅ Verification Complete.');
    } catch (error) {
        console.error('\n❌ Verification Failed:');
        console.error(error);
    }
}

runTests().catch(console.error);
