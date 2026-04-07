import NotificationsList from "@/components/features/notifications/notifications-list";

export const metadata = {
  title: "Admin Notifications | Green Loop",
  description: "View all admin notifications",
};

export default function AdminNotificationsPage() {
  return (
    <div className="max-w-4xl">
      <NotificationsList />
    </div>
  );
}
