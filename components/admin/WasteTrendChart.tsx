'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';

/**
 * WasteTrendData type definition
 */
export type WasteTrendData = {
    date: string;       // ISO date string (YYYY-MM-DD)
    totalWaste: number; // aggregated waste volume
};

interface WasteTrendChartProps {
    data: WasteTrendData[];
}

/**
 * WasteTrendChart Component
 * Visualizes waste volume trends over time for the Green Loop Admin Dashboard.
 */
const WasteTrendChart = ({ data }: WasteTrendChartProps) => {
    // Handle edge case: No data available
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 w-full h-[400px] flex items-center justify-center border border-slate-100">
                <p className="text-slate-400 font-medium">No waste trend data available.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 w-full flex flex-col h-[400px]">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Waste Trends</h3>
                <p className="text-sm text-slate-500">Volume collected over the last 30 days (kg)</p>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        {/* Subtle horizontal grid lines */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                            tickFormatter={(str) => {
                                try {
                                    return format(parseISO(str), 'MMM d');
                                } catch (e) {
                                    return str;
                                }
                            }}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickFormatter={(value) => `${value}kg`}
                        />

                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            }}
                            labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                            formatter={(value: number) => [`${value} kg`, 'Total Waste']}
                            labelFormatter={(label) => {
                                try {
                                    return format(parseISO(label), 'EEEE, MMMM d, yyyy');
                                } catch (e) {
                                    return label;
                                }
                            }}
                        />

                        {/* Smooth monotone line using Green Loop emerald primary tone */}
                        <Line
                            type="monotone"
                            dataKey="totalWaste"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WasteTrendChart;
