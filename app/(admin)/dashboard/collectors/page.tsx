import { getCollectorPerformance } from "@/lib/admin/analytics";
import CollectorTable from "./collector-table";

interface PageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function CollectorPerformancePage({ searchParams }: PageProps) {
    // Await searchParams for Next.js 15
    const { page: pageStr } = await searchParams;
    const page = Math.max(Number(pageStr) || 1, 1);

    const result = await getCollectorPerformance({
        page,
        limit: 2, // Small limit for pagination testing
        sortBy: "completionRate",
        sortOrder: "desc",
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
            <CollectorTable data={result.data} meta={meta} />
        </div>
    );
}
