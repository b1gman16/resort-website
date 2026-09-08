import { getBookingStats } from "@/lib/queries/admin-bookings";

export default async function AdminDashboardPage() {
  const stats = await getBookingStats();

  const cards = [
    { label: "Pending", value: stats.pending, color: "text-amber-600" },
    { label: "Confirmed", value: stats.confirmed, color: "text-green-600" },
    { label: "Completed", value: stats.completed, color: "text-blue-600" },
    { label: "Cancelled", value: stats.cancelled, color: "text-slate-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={`text-3xl font-semibold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}