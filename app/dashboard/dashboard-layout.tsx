'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Truck, Shield, LogOut, Package2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ');

const Button: React.FC<any> = ({ children, className, variant = 'default', ...props }) => (
  <button
    className={cn(
      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
      variant === 'default' && 'bg-gray-800 text-white hover:bg-gray-700',
      variant === 'outline' && 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
      variant === 'ghost' && 'bg-transparent text-gray-700 hover:bg-gray-100',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const ScrollArea: React.FC<any> = ({ children, className }) => (
  <div className={cn("overflow-y-auto", className)} style={{ maxHeight: '100%' }}>
    {children}
  </div>
);

interface NavItem {
  href: string;
  label: string;
  roles: ('user' | 'collector' | 'admin')[];
  icon: React.ElementType;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: '/dashboard/user', label: 'My Pickups', roles: ['user', 'admin'], icon: Home },
  { href: '/dashboard/collector', label: 'My Routes', roles: ['collector', 'admin'], icon: Truck },
  { href: '/dashboard/admin', label: 'System Overview', roles: ['admin'], icon: Shield },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'user' | 'collector' | 'admin';
}

const roleColors = {
  user: "text-green-500",
  collector: "text-blue-500",
  admin: "text-red-500",
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole }) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = ALL_NAV_ITEMS.filter(item => item.roles.includes(userRole));
  const roleDisplayName = userRole.charAt(0).toUpperCase() + userRole.slice(1);
  const RoleIcon = userRole === 'admin' ? Shield : userRole === 'collector' ? Truck : Home;

  return (
    <div className="flex min-h-screen bg-gray-50 antialiased">
      <aside className="hidden md:flex flex-col w-64 border-r bg-white shadow-lg fixed top-0 left-0 h-full z-10">
        <div className="p-4 flex items-center h-16 border-b">
          <Package2 className="h-6 w-6 text-green-600" />
          <span className="ml-2 text-xl font-bold text-gray-800">GreenLoop Dash</span>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-4 py-2.5 transition-colors duration-200 text-sm font-medium",
                    isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 mb-2 flex items-center space-x-1">
            <RoleIcon className={cn("h-4 w-4", roleColors[userRole])} />
            <span>Logged in as: </span>
            <span className={cn("font-semibold", roleColors[userRole])}>{roleDisplayName}</span>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50/70 hover:text-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col">
        <div className="p-4 md:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
