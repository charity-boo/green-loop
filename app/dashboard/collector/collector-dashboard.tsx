
'use client';

import React from "react";
import { CollectorTask } from "@/types";

// --- MOCK SHADCN COMPONENTS (for now) ---
interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

interface TableProps {
  children?: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children?: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children?: React.ReactNode;
  className?: string;
}

interface TableHeadProps {
  children?: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => <div className={`rounded-xl border bg-white shadow ${className}`}>{children}</div>;
const CardHeader: React.FC<CardProps> = ({ children, className }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle: React.FC<CardProps> = ({ children, className }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent: React.FC<CardProps> = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const Table: React.FC<TableProps> = ({ children, className }) => <div className={cn("w-full overflow-auto", className)}><table className="w-full caption-bottom text-sm">{children}</table></div>;
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => <thead className={cn("[&_tr]:border-b", className)}>{children}</thead>;
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => <tbody className={cn("[&_tr:last-child]:border-0", className)}>{children}</tbody>;
const TableRow: React.FC<TableRowProps> = ({ children, className }) => <tr className={cn("border-b transition-colors hover:bg-gray-50", className)}>{children}</tr>;
const TableHead: React.FC<TableHeadProps> = ({ children, className }) => <th className={cn("h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0", className)}>{children}</th>;
const TableCell: React.FC<TableCellProps> = ({ children, className }) => <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}>{children}</td>;
// --- END MOCK COMPONENTS ---


import { WasteStatus } from "@/lib/types/waste-status";
import { WasteStatusDisplay, WasteStatusColor } from "@/lib/types/waste-status-display";
import { FirebaseStatusDisplay, FirebaseStatusColor, DefaultStatusColor } from "@/lib/types/firebase-status-display";

export default function CollectorDashboard({ tasks }: { tasks: CollectorTask[] }) {
  const summary = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === WasteStatus.Completed).length,
    pending: tasks.filter(t => t.status === WasteStatus.Pending).length,
  };

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-4xl font-extrabold text-blue-800">Route & Pickup Management</h1>
      <p className="text-lg text-gray-600">Your assigned route tasks for today.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Stops Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-blue-600">{summary.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Stops</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-green-600">{summary.completed} / {summary.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Stops</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-yellow-600">{summary.pending}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pickup Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time Slot</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Waste Type</TableHead>
                <TableHead>Firebase Status</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.type}</TableCell>
                  <TableCell>
                    {task.firebaseStatus ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${FirebaseStatusColor[task.firebaseStatus] || DefaultStatusColor}`}
                        title={`Last updated: ${new Date(task.updatedAt).toLocaleString()}`}
                      >
                        {FirebaseStatusDisplay[task.firebaseStatus] || task.firebaseStatus}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${WasteStatusColor[task.status]}`}
                      title={`Last updated: ${new Date(task.updatedAt).toLocaleString()}`}
                    >
                      {WasteStatusDisplay[task.status]}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
