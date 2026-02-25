import { getCollectorPerformance } from "@/lib/admin/analytics";
import CollectorTable from "./collector-table";
import { subDays } from "date-fns";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        sortBy?: string;
        sortOrder?: string;
        window?: string;
    }>;
}

export default async function CollectorPerformancePage({ searchParams }: PageProps) {
    // Await searchParams for Next.js 15
    const {
        page: pageStr,
        sortBy: sortByStr,
        sortOrder: sortOrderStr,
        window: windowStr
    } = await searchParams;

    // Window Sanitization
    const allowedWindows = ["7", "30", "90", "all"] as const;
    const window = allowedWindows.includes(windowStr as any)
        ? (windowStr as typeof allowedWindows[number])
        : "30";

    // Date Calculation
    let startDate: Date | undefined;
    const now = new Date();
    if (window === "7") startDate = subDays(now, 7);
    else if (window === "30") startDate = subDays(now, 30);
    else if (window === "90") startDate = subDays(now, 90);
    else startDate = undefined; // "all"

    // Page Sanitization
    const page = Math.max(Number(pageStr) || 1, 1);

    // Sort Whitelisting
    const allowedSort = ["name", "assigned", "missed", "completionRate"] as const;
    const sortBy = allowedSort.includes(sortByStr as any)
        ? (sortByStr as typeof allowedSort[number])
        : "completionRate";

    const sortOrder = sortOrderStr === "asc" ? "asc" : "desc";

    const result = await getCollectorPerformance({
        page,
        limit: 2, // Small limit for pagination testing
        sortBy,
        sortOrder,
        startDate,
    });

    // Explicit meta mapping for architectural hygiene
    const meta = {
        totalCount: result.total,
        totalPages: result.totalPages,
        currentPage: result.page,
        pageSize: result.limit,
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Collector Performance</h1>
            <CollectorTable
                data={result.data}
                meta={meta}
                sortBy={sortBy}
                sortOrder={sortOrder}
                window={window}
            />
        </div>
    );
}
