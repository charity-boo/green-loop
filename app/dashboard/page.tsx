'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardRootPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login"); // redirect unauthenticated users
      } else {
        // redirect based on role
        switch (user.role) {
          case "admin":
            router.push("/dashboard/admin");
            break;
          case "collector":
            router.push("/dashboard/collector");
            break;
          default:
            router.push("/dashboard/user");
        }
      }
    }
  }, [user, isLoading, router]);

  return <p>Loading...</p>;
}
