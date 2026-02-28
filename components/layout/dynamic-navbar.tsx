"use client";

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const Navbar = dynamic(() => import('@/components/layout/navbar'), { ssr: false });

export default function DynamicNavbar() {
  const pathname = usePathname();
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) return null;
  return <Navbar />;
}
