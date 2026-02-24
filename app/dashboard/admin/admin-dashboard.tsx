
'use client';

import React from "react";
import { AdminDashboardData } from "@/types";

// --- MOCK SHADCN COMPONENTS (for now) ---
interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

interface SeparatorProps {
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => <div className={`rounded-xl border bg-white shadow ${className}`}>{children}</div>;
const CardHeader: React.FC<CardProps> = ({ children, className }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle: React.FC<CardProps> = ({ children, className }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent: React.FC<CardProps> = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Separator: React.FC<SeparatorProps> = ({ className }) => <div className={`h-[1px] w-full bg-gray-200 ${className}`} />;
// --- END MOCK COMPONENTS ---


export default function AdminDashboard({ data }: { data: AdminDashboardData }) {

  return (
    <div className="space-y-10 p-4">
      <h1 className="text-4xl font-extrabold text-red-700">Administrator Control Center</h1>
      <p className="text-lg text-gray-600">Full system oversight, metrics, and user management.</p>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-red-600">{data.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Collectors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-blue-600">{data.activeCollectors}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-yellow-600">{data.openRequests}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Load</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold text-green-600">{data.systemLoad}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-700">
              {data.recentActivity.map(activity => (
                <li key={activity.id}>[{activity.timestamp}] {activity.message}</li>
              ))}
              {data.recentActivity.length === 0 && <li>No recent activity</li>}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Management Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <button className="bg-gray-100 p-3 rounded-lg text-left hover:bg-gray-200">Manage Collector Accounts</button>
              <button className="bg-gray-100 p-3 rounded-lg text-left hover:bg-gray-200">Review Open Disputes</button>
              <button className="bg-gray-100 p-3 rounded-lg text-left hover:bg-gray-200">Generate Monthly Report</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
