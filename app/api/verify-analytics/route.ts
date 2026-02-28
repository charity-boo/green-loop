import { NextResponse } from 'next/server';
import { getCollectorPerformance } from '@/lib/firebase/services/analytics';
import { subDays } from 'date-fns';

export async function GET() {
    const results: Record<string, unknown> = {};

    try {
        // Case 1: Default Window
        results.case1 = await getCollectorPerformance({});

        // Case 2: Narrow Window
        results.case2 = await getCollectorPerformance({
            startDate: subDays(new Date(), 1)
        });

        // Case 3: Lifetime
        results.case3 = await getCollectorPerformance({
            startDate: new Date('2000-01-01')
        });

        // Case 4: Sorting
        results.case4 = await getCollectorPerformance({
            sortBy: 'assigned',
            sortOrder: 'asc',
            limit: 5
        });

        // Case 5: Pagination
        results.case5 = await getCollectorPerformance({
            page: 2,
            limit: 2
        });

        return NextResponse.json({ success: true, results });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : undefined;
        return NextResponse.json({
            success: false,
            error: message,
            stack: stack
        }, { status: 500 });
    }
}
