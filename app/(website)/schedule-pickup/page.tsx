import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SchedulePickupForm from "./schedule-pickup-form";
import { adminDb } from "@/lib/firebase/admin";

export default async function SchedulePickupPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login?callbackUrl=/schedule-pickup");
  }

  const userDoc = await adminDb.collection("users").doc(session.user.id).get();
  const userData = userDoc.data();
  const userName = userData?.name || userData?.displayName || session.user.name || "";

  return <SchedulePickupForm userName={userName} />;
}
