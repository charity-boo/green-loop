import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SchedulePickupForm from "./schedule-pickup-form";
import { adminDb } from "@/lib/firebase/admin";

export default async function SchedulePickupPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login?callbackUrl=/schedule-pickup");
  }

  const [userDoc, activeSchedules] = await Promise.all([
    adminDb.collection("users").doc(session.user.id).get(),
    adminDb.collection("schedules")
      .where("userId", "==", session.user.id)
      .where("status", "in", ["pending", "assigned"])
      .limit(1)
      .get()
  ]);

  const userData = userDoc.data();
  const userName = userData?.name || userData?.displayName || session.user.name || "";
  const hasActivePickup = !activeSchedules.empty;

  return <SchedulePickupForm userName={userName} hasActivePickup={hasActivePickup} />;
}
