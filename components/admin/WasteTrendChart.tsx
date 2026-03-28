'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';

export type WasteTrendData = {
    date: string;
    totalWaste: number;
};

interface WasteTrendChartProps {
    data: WasteTrendData[];
}

const WasteTrendChart = ({ data }: WasteTrendChartProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center">
                <p className="text-slate-400 text-sm">No data available</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        vertical={false} 
                        stroke="#f8fafc" 
                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        dy={10}
                        tickFormatter={(str) => {
                            try {
                                return format(parseISO(str), 'EEE');
                            } catch (_e) {
                                return str;
                            }
                        }}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickFormatter={(value) => `${value}kg`}
                    />

                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-card p-2 shadow-sm border border-border rounded-lg">
                                        <p className="text-xs font-bold text-foreground">
                                            {payload[0].value} kg
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    <Bar
                        dataKey="totalWaste"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        barSize={24}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fillOpacity={index === data.length - 1 ? 1 : 0.7}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WasteTrendChart;
