"use server";

import { isRoomAvailable } from "@/lib/queries/rooms";

// Thin wrapper so the Client Component form can call this via a normal
// async function call, same as any Server Action. This is a UX check only
// (see the comment on isRoomAvailable itself) — the real guarantee is
// still the database exclusion constraint, exercised at admin-confirm time.
export async function checkAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  return isRoomAvailable(roomId, checkIn, checkOut);
}