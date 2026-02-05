'use client';

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "../dashboard-layout";
import ProtectedRoute from "@/components/auth/protectedroute";
import { PickupHistoryItem, UserMetrics, WasteContribution } from "@/types";

// --- MOCK SHADCN COMPONENTS (for runnability) ---
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
  onClick?: () => void;
}

interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
}

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => <div className={`rounded-xl border bg-white shadow ${className}`}>{children}</div>;
const CardHeader: React.FC<CardProps> = ({ children, className }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle: React.FC<CardProps> = ({ children, className }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent: React.FC<CardProps> = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Table: React.FC<TableProps> = ({ children, className }) => <div className={`w-full overflow-auto ${className}`}><table className="w-full caption-bottom text-sm">{children}</table></div>;
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => <thead className={`[&_tr]:border-b ${className}`}>{children}</thead>;
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>;
const TableRow: React.FC<TableRowProps> = ({ children, className }) => <tr className={`border-b transition-colors hover:bg-gray-50 ${className}`}>{children}</tr>;
const TableHead: React.FC<TableHeadProps> = ({ children, className, ...props }) => <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>{children}</th>;
const TableCell: React.FC<TableCellProps> = ({ children, className }) => <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>;
const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variant === 'default' ? 'bg-gray-100 text-gray-800' : variant === 'success' ? 'bg-green-100 text-green-800' : variant === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''} ${className}`}>
        {children}
    </span>
);
// --- End Mock Components ---

// Mock data
const userMetrics: UserMetrics = {
  totalPickups: 28,
  totalWeight: 152.5, // in kg
  rewardPoints: 1250,
  lastPickup: "2025-11-10",
};

const pickupHistory: PickupHistoryItem[] = [
  { id: "PUK-001", date: "2025-11-10", status: "Completed", weight: 15.2, wasteType: "Mixed Recyclables", points: 150 },
  { id: "PUK-002", date: "2025-10-25", status: "Completed", weight: 12.8, wasteType: "Plastics", points: 130 },
  { id: "PUK-003", date: "2025-10-10", status: "Completed", weight: 20.5, wasteType: "Paper and Cardboard", points: 200 },
  { id: "PUK-004", date: "2025-09-28", status: "Completed", weight: 8.0, wasteType: "Glass", points: 80 },
  { id: "PUK-005", date: "2025-09-12", status: "Cancelled", weight: 0, wasteType: "N/A", points: 0 },
  { id: "PUK-006", date: "2025-08-30", status: "Completed", weight: 18.0, wasteType: "Mixed Recyclables", points: 180 },
];

const wasteContributionData: WasteContribution[] = [
  { name: "Plastics", weight: 45.2 },
  { name: "Paper", weight: 60.8 },
  { name: "Glass", weight: 22.5 },
  { name: "Organic", weight: 15.0 },
  { name: "E-Waste", weight: 9.0 },
];

type SortKey = "date" | "weight" | "points";
type SortDirection = "asc" | "desc";

export default function UserDashboardPage() {
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({ status: true, weight: true, wasteType: true, points: true });
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: "date", direction: "desc" });

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedHistory = [...pickupHistory]
    .filter((item: PickupHistoryItem) =>
      Object.values(item).some((val: string | number) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a: PickupHistoryItem, b: PickupHistoryItem) => {
      if (!sortConfig) return 0;
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <ProtectedRoute allowedRole="user">
      <DashboardLayout userRole={user.role}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">User Dashboard</h2>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pickups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userMetrics.totalPickups}</div>
                <p className="text-xs text-gray-500">
                  Last pickup on {userMetrics.lastPickup}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Weight Recycled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userMetrics.totalWeight} kg</div>
                <p className="text-xs text-gray-500">+20.1&#37; from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userMetrics.rewardPoints}</div>
                <p className="text-xs text-gray-500">+180 points this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Waste Contribution & Recent Pickups */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Waste Contribution Chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Waste Contribution</CardTitle>
                <p className="text-sm text-gray-500">
                  Total weight of different waste types you&apos;ve recycled.
                </p>
              </CardHeader>
              <CardContent>
                {/* Your chart component would go here */}
                <div className="h-80 flex items-center justify-center text-gray-400">Chart Placeholder</div>
              </CardContent>
            </Card>

            {/* Recent Pickups Table */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Pickups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => handleSort("date")}>
                          Date {getSortIcon("date")}
                        </TableHead>
                        {visibleColumns.status && <TableHead>Status</TableHead>}
                        {visibleColumns.wasteType && <TableHead>Waste Type</TableHead>}
                        {visibleColumns.weight && <TableHead>Weight (kg)</TableHead>}
                        {visibleColumns.points && <TableHead>Points</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedHistory.map((pickup) => (
                        <TableRow key={pickup.id}>
                          <TableCell>{pickup.date}</TableCell>
                          {visibleColumns.status && <TableCell>{pickup.status}</TableCell>}
                          {visibleColumns.wasteType && <TableCell>{pickup.wasteType}</TableCell>}
                          {visibleColumns.weight && <TableCell>{pickup.weight.toFixed(1)}</TableCell>}
                          {visibleColumns.points && <TableCell>{pickup.points}</TableCell>}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
