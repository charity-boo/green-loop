'use client';

import React from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "../dashboard-layout";
import ProtectedRoute from "@/components/auth/protectedroute"; // ensure file name casing matches

// --- MOCK SHADCN COMPONENTS (for now) ---
const Card: React.FC<any> = ({ children, className }) => <div className={`rounded-xl border bg-white shadow ${className}`}>{children}</div>;
const CardHeader: React.FC<any> = ({ children, className }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle: React.FC<any> = ({ children, className }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent: React.FC<any> = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Badge: React.FC<any> = ({ children, variant = 'default', className }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors
    ${variant === 'default' ? 'bg-gray-100 text-gray-800' : ''}
    ${variant === 'success' ? 'bg-green-100 text-green-800' : ''}
    ${variant === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
    ${className}`}>
    {children}
  </span>
);
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const Table: React.FC<any> = ({ children, className }) => <div className={cn("w-full overflow-auto", className)}><table className="w-full caption-bottom text-sm">{children}</table></div>;
const TableHeader: React.FC<any> = ({ children, className }) => <thead className={cn("[&_tr]:border-b", className)}>{children}</thead>;
const TableBody: React.FC<any> = ({ children, className }) => <tbody className={cn("[&_tr:last-child]:border-0", className)}>{children}</tbody>;
const TableRow: React.FC<any> = ({ children, className }) => <tr className={cn("border-b transition-colors hover:bg-gray-50", className)}>{children}</tr>;
const TableHead: React.FC<any> = ({ children, className }) => <th className={cn("h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0", className)}>{children}</th>;
const TableCell: React.FC<any> = ({ children, className }) => <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}>{children}</td>;
// --- END MOCK COMPONENTS ---

export default function CollectorDashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <ProtectedRoute allowedRole="collector">
      <DashboardLayout userRole={user.role}>
        <div className="space-y-8 p-4">
          <h1 className="text-4xl font-extrabold text-blue-800">Route & Pickup Management</h1>
          <p className="text-lg text-gray-600">Your assigned route tasks for today.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Stops Today</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-extrabold text-blue-600">18</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Completed Stops</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-extrabold text-green-600">12 / 18</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tonnage Collected (Est.)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-extrabold text-gray-800">4.5 Tons</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pending Pickups List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Waste Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">11:00 AM</TableCell>
                    <TableCell>456 Oak St</TableCell>
                    <TableCell>Recyclables</TableCell>
                    <TableCell><Badge variant="warning">Awaiting</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1:30 PM</TableCell>
                    <TableCell>80 Pine Ln</TableCell>
                    <TableCell>General Waste</TableCell>
                    <TableCell><Badge variant="success">Completed</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
