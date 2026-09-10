"use client";

import { useState, useTransition } from "react";
import { toggleRoomActive } from "@/app/admin/(protected)/rooms/actions";

export function RoomActiveToggle({
  roomId,
  isActive,
}: {
  roomId: string;
  isActive: boolean;
}) {
  const [active, setActive] = useState(isActive);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !active;
    setActive(next); // optimistic
    startTransition(async () => {
      const result = await toggleRoomActive(roomId, active);
      if (!result.success) setActive(!next); // revert on failure
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`text-xs px-2 py-1 rounded font-medium disabled:opacity-50 ${
        active ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"
      }`}
    >
      {active ? "Active" : "Hidden"}
    </button>
  );
}