'use client';

import React, { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
interface WasteDistributionData {
  wasteType: string;
  count: number;
}

interface WasteDistributionChartProps {
    data: WasteDistributionData[];
}

/**
 * Stable Color Mapping for Waste Types
 * Ensures consistent visual identity across the dashboard.
 */
const WASTE_TYPE_COLORS: Record<string, string> = {
    ORGANIC: '#10b981',
    PLASTIC: '#3b82f6',
    RECYCLABLE: '#f59e0b',
    HAZARDOUS: '#ef4444',
};

/**
 * WasteDistributionChart Component
 * Visualizes the breakdown of waste materials using a clean, modern Pie Chart.
 */
const WasteDistributionChart = ({ data }: WasteDistributionChartProps) => {
    // Calculate total and handle empty/zero states
    const { total, hasData } = useMemo(() => {
        const sum = data.reduce((acc, curr) => acc + curr.count, 0);
        return {
            total: sum,
            hasData: sum > 0,
        };
    }, [data]);

    if (!hasData) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 w-full h-[400px] flex items-center justify-center border border-slate-100">
                <p className="text-slate-400 font-medium">No waste distribution data available.</p>
            </div>
        );
    }

    // Format label for better readability
    const formatLabel = (name: string) => {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 w-full flex flex-col h-[400px]">
            <div className="mb-2">
                <h3 className="text-lg font-bold text-slate-900">Waste Distribution</h3>
                <p className="text-sm text-slate-500">Breakdown of reported materials by category</p>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="count"
                            nameKey="wasteType"
                            animationDuration={1500}
                        >
                            {data.map((entry) => (
                                <Cell
                                    key={`cell-${entry.wasteType}`}
                                    fill={WASTE_TYPE_COLORS[entry.wasteType] || '#cbd5e1'}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload as WasteDistributionData;
                                    const percentage = ((item.count / total) * 100).toFixed(1);
                                    return (
                                        <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-100">
                                            <p className="font-bold text-slate-900">{formatLabel(item.wasteType)}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: WASTE_TYPE_COLORS[item.wasteType] }}
                                                />
                                                <p className="text-sm text-slate-600">
                                                    {item.count} items ({percentage}%)
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => (
                                <span className="text-xs font-medium text-slate-600 ml-1">
                                    {formatLabel(value)}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WasteDistributionChart;
