import { NextResponse } from 'next/server';
import { getDashboardKPIs, getWasteTrendData, getWasteDistribution } from '@/lib/firebase/services/analytics';
import { handleApiError } from '@/lib/api-handler';

export async function GET() {
  try {
    const [kpis, trendData, distributionData] = await Promise.all([
      getDashboardKPIs(),
      getWasteTrendData(),
      getWasteDistribution(),
    ]);

    return NextResponse.json({
      kpis,
      trendData,
      distributionData,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/stats');
  }
}
