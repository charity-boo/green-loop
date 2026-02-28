/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
    weight: {
        label: "Weight (KG)",
    },
    Plastic: {
        label: "Plastic",
        color: "var(--chart-1)",
    },
    Paper: {
        label: "Paper",
        color: "var(--chart-2)",
    },
    Glass: {
        label: "Glass",
        color: "var(--chart-3)",
    },
    Metal: {
        label: "Metal",
        color: "var(--chart-4)",
    },
    Organic: {
        label: "Organic",
        color: "var(--chart-5)",
    },
    Unknown: {
        label: "Other",
        color: "var(--muted-foreground)",
    },
} satisfies ChartConfig;

interface MaterialImpactChartProps {
    data: Array<{ type: string; weight: number; percentage: number }>;
}

export default function MaterialImpactChart({ data }: MaterialImpactChartProps) {
    // Map data to include fill colors from config
    const chartData = React.useMemo(() => {
        return data.map((item) => ({
            ...item,
            fill: (chartConfig as any)[item.type]?.color || chartConfig.Unknown.color,
        }));
    }, [data]);

    return (
        <Card className="flex flex-col rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden h-full">
            <CardHeader className="items-start pb-0 p-8">
                <CardTitle className="text-xl font-black text-slate-900">Material Breakdown</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Distribution of waste by category (KG)</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 p-8 pt-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="weight"
                            nameKey="type"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-4 mt-4 pb-8">
                    {data.slice(0, 4).map((item) => (
                        <div key={item.type} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: (chartConfig as any)[item.type]?.color || chartConfig.Unknown.color }}
                            />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                                {item.type}: {item.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
