import { getCollectorPerformance } from "@/lib/firebase/services/analytics";
import CollectorTable from "./collector-table";
import { subDays } from "date-fns";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        sortBy?: string;
        sortOrder?: string;
        window?: string;
        search?: string;
    }>;
}

type AllowedWindow = "7" | "30" | "90" | "all";
type AllowedSort = "name" | "assigned" | "missed" | "completionRate";

export default async function CollectorPerformancePage({ searchParams }: PageProps) {
    // Await searchParams for Next.js 15
    const {
        page: pageStr,
        sortBy: sortByStr,
        sortOrder: sortOrderStr,
        window: windowStr,
        search
    } = await searchParams;

    // Window Sanitization
    const allowedWindows: AllowedWindow[] = ["7", "30", "90", "all"];
    const window: AllowedWindow = allowedWindows.includes(windowStr as AllowedWindow)
        ? (windowStr as AllowedWindow)
        : "30";

    // Date Calculation
    let startDate: Date;
    const now = new Date();
    if (window === "7") startDate = subDays(now, 7);
    else if (window === "30") startDate = subDays(now, 30);
    else if (window === "90") startDate = subDays(now, 90);
    else startDate = new Date(0); // "all"

    // Page Sanitization
    const page = Math.max(Number(pageStr) || 1, 1);

    // Sort Whitelisting
    const allowedSort: AllowedSort[] = ["name", "assigned", "missed", "completionRate"];
    const sortBy: AllowedSort = allowedSort.includes(sortByStr as AllowedSort)
        ? (sortByStr as AllowedSort)
        : "completionRate";

    const sortOrder = sortOrderStr === "asc" ? "asc" : "desc";

    const result = await getCollectorPerformance({
        page,
        limit: 10,
        sortBy,
        sortOrder,
        startDate,
        search,
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
                search={search}
            />
        </div>
    );
}
