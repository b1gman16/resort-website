import { notFound } from "next/navigation";
import { getRoomById } from "@/lib/queries/rooms";
import { BookingForm } from "./booking-form";

type Props = {
  searchParams: Promise<{ room?: string }>;
};

export default async function BookPage({ searchParams }: Props) {
  const { room: roomId } = await searchParams;

  // No room param at all, or it doesn't resolve to a real room — both are
  // "this link is broken/stale" situations, correctly a 404 rather than a
  // confusing blank form with no room context.
  if (!roomId) {
    notFound();
  }

  const room = await getRoomById(roomId);

  if (!room) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">Book {room.name}</h1>
      <p className="text-slate-500 mt-1">
        ₱{room.base_price.toLocaleString()} / night · Up to {room.capacity} guests
      </p>

      <BookingForm room={room} />
    </div>
  );
}