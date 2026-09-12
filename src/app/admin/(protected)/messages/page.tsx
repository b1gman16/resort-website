import { getContactMessages } from "@/lib/queries/admin-messages";
import { MessageRow } from "@/components/admin/message-row";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  const unreadCount = messages.filter((m) => !m.read_at).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-[content-fade-in_0.4s_ease-out]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Messages</h1>
        {unreadCount > 0 && (
          <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded">
            {unreadCount} unread
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <p className="text-slate-500">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <MessageRow key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
}