'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Truck, Shield, LogOut, Package2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/lib/auth";

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ');

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'default', ...props }) => (
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

const ScrollArea: React.FC<ScrollAreaProps> = ({ children, className }) => (
  <div className={cn("overflow-y-auto", className)} style={{ maxHeight: '100%' }}>
    {children}
  </div>
);

interface NavItem {
  href: string;
  label: string;
  roles: Role[];
  icon: React.ElementType;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { href: '/dashboard/user', label: 'Analytics', roles: ['USER'], icon: Home },
  { href: '/dashboard/user/pickups', label: 'Recycling Progress', roles: ['USER'], icon: Package2 },
  { href: '/dashboard/user/schedule', label: 'Collection Points', roles: ['USER'], icon: Truck },
  { href: '/dashboard/user/impact', label: 'Impact Reports', roles: ['USER'], icon: Shield },

  { href: '/dashboard/collector', label: 'My Routes', roles: ['COLLECTOR'], icon: Truck },
  { href: '/dashboard/admin', label: 'System Overview', roles: ['ADMIN'], icon: Shield },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: Role;
}

const roleColors: Record<Role, string> = {
  'USER': "text-green-500",
  'COLLECTOR': "text-blue-500",
  'ADMIN': "text-red-500",
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = ALL_NAV_ITEMS.filter(item => item.roles.includes(userRole));
  const roleDisplayName = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] antialiased">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-24 bg-[#1B4332] text-white fixed top-0 left-0 h-full z-20 shadow-2xl transition-all duration-300">
        <div className="p-6 flex flex-col items-center gap-2">
          <div className="h-12 w-12 bg-green-400 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Package2 className="h-7 w-7 text-[#1B4332]" />
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-6">
          <nav className="flex flex-col items-center gap-6">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all duration-300 group relative",
                    isActive
                      ? "bg-white/15 text-white shadow-xl backdrop-blur-md"
                      : "text-green-100/70 hover:bg-white/5 hover:text-white"
                  )}
                  title={item.label}
                >
                  <Icon className={cn(
                    "h-6 w-6 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-green-400" : "text-green-200"
                  )} />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-center">{item.label.split(' ')[0]}</span>
                  {isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-green-400 rounded-r-full shadow-[2px_0_8px_rgba(74,222,128,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 mt-auto flex flex-col items-center gap-4 border-t border-white/10">
          <button
            onClick={logout}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-red-400/10 hover:bg-red-400/20 text-red-200 border border-red-400/20 transition-all duration-300"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-24 min-h-screen flex flex-col relative bg-white">
        <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black tracking-tight text-gray-900">Green Loop <span className="text-green-500">Workspace</span></h2>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-gray-900 tracking-tight">{user?.displayName || 'User'}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100 transform -translate-y-0.5">{roleDisplayName}</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#2D5A27] flex items-center justify-center text-white font-black text-xl shadow-xl overflow-hidden border-2 border-white ring-4 ring-green-50/50">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full object-cover" />
              ) : (
                <span className="capitalize">{user?.displayName?.[0] || user?.email?.[0] || 'U'}</span>
              )}
            </div>
          </div>
        </header>
        <div className="p-10 max-w-full mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
