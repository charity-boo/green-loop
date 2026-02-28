import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SchedulePickupForm from "./schedule-pickup-form";

export default async function SchedulePickupPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login?callbackUrl=/schedule-pickup");
  }

  return <SchedulePickupForm userName={session.user.name || ""} />;
}
