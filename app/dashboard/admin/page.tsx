'use client';

import React from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "../dashboard-layout";
import ProtectedRoute from "@/components/auth/protectedroute"; // corrected casing

// --- MOCK SHADCN COMPONENTS (for now) ---
const Card: React.FC<any> = ({ children, className }) => <div className={`rounded-xl border bg-white shadow ${className}`}>{children}</div>;
const CardHeader: React.FC<any> = ({ children, className }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle: React.FC<any> = ({ children, className }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent: React.FC<any> = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Separator: React.FC<any> = ({ className }) => <div className={`h-[1px] w-full bg-gray-200 ${className}`} />;
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');
// --- END MOCK COMPONENTS ---

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <ProtectedRoute allowedRole="admin">
      <DashboardLayout userRole={user.role}>
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
                <p className="text-5xl font-extrabold text-red-600">1,530</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Collectors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-extrabold text-blue-600">22</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Open Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-extrabold text-yellow-600">87</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Load</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-extrabold text-green-600">Low</p>
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
                  <li>[10:30 AM] Collector 14 marked Route B complete.</li>
                  <li>[09:15 AM] New user registered: Jane Doe.</li>
                  <li>[08:00 AM] System Health check passed.</li>
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
      </DashboardLayout>
    </ProtectedRoute>
  );
}
