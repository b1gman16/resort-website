"use client";

import { useState, useTransition } from "react";
import type { ContactMessage } from "@/lib/queries/admin-messages";
import { markAsRead } from "@/app/admin/(protected)/messages/actions";

export function MessageRow({ message }: { message: ContactMessage }) {
  const [isRead, setIsRead] = useState(!!message.read_at);
  const [isPending, startTransition] = useTransition();

  // Marks read automatically the first time the card is expanded — no
  // separate "mark as read" button needed, since opening it to read the
  // message already communicates the same intent a click would.
  function handleExpand() {
    if (isRead) return;
    setIsRead(true); // optimistic — flips immediately, doesn't wait on the network
    startTransition(() => {
      markAsRead(message.id);
    });
  }

  return (
    <details
      onToggle={(e) => e.currentTarget.open && handleExpand()}
      className={`bg-white rounded-lg shadow-sm p-4 ${!isRead ? "border-l-4 border-amber-400" : ""}`}
    >
      <summary className="cursor-pointer flex items-center justify-between">
        <div>
          <span className={`font-medium ${!isRead ? "text-slate-900" : "text-slate-600"}`}>
            {message.name}
          </span>
          <span className="text-xs text-slate-400 ml-2">{message.email}</span>
        </div>
        <span className="text-xs text-slate-400">
          {new Date(message.created_at).toLocaleDateString()}
        </span>
      </summary>
      <p className="text-sm text-slate-600 mt-3 whitespace-pre-line">{message.message}</p>
    </details>
  );
}