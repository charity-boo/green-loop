"use client";

import dynamic from 'next/dynamic';

const DynamicNavbar = dynamic(() => import('@/components/layout/navbar'), {
  ssr: false,
});

export default DynamicNavbar;
