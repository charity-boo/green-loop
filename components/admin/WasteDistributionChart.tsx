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

const WASTE_TYPE_COLORS: Record<string, string> = {
    ORGANIC: '#059669',
    PLASTIC: '#10b981',
    METAL: '#6ee7b7',
    RECYCLABLE: '#a7f3d0',
    HAZARDOUS: '#064e3b',
};

const WasteDistributionChart = ({ data }: WasteDistributionChartProps) => {
    const { hasData } = useMemo(() => {
        const sum = data.reduce((acc, curr) => acc + curr.count, 0);
        return { hasData: sum > 0 };
    }, [data]);

    if (!hasData) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center">
                <p className="text-slate-400 text-sm">No data available</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="wasteType"
                    >
                        {data.map((entry) => (
                            <Cell
                                key={`cell-${entry.wasteType}`}
                                fill={WASTE_TYPE_COLORS[entry.wasteType] || '#10b981'}
                                stroke="none"
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const item = payload[0].payload as WasteDistributionData;
                                return (
                                    <div className="bg-card p-2 shadow-sm border border-border rounded-lg">
                                        <p className="text-xs font-bold text-foreground">
                                            {item.wasteType}: {item.count}
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider ml-1">
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WasteDistributionChart;
