import NotificationsList from "@/components/features/notifications/notifications-list";

export const metadata = {
  title: "Notifications | Green Loop",
  description: "View all your notifications",
};

export default function NotificationsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <NotificationsList />
    </div>
  );
}
