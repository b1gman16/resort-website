"use client";

import { useState, useTransition } from "react";
import { roomSchema } from "@/lib/validations/room";
import type { RoomActionResult } from "@/app/admin/(protected)/rooms/actions";
import type { AdminRoom } from "@/lib/queries/admin-rooms";

export function RoomForm({
  initialRoom,
  onSubmit,
}: {
  initialRoom?: AdminRoom;
  onSubmit: (data: ReturnType<typeof roomSchema.parse>) => Promise<RoomActionResult>;
}) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function handleSubmit(formData: FormData) {
    setFormError(null);
    setFieldErrors({});

    const raw = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      basePrice: formData.get("basePrice"),
      capacity: formData.get("capacity"),
      totalUnits: formData.get("totalUnits"),
    };

    const parsed = roomSchema.safeParse(raw);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await onSubmit(parsed.data);
      // On success, onSubmit redirects server-side (see Step 5) — this
      // component only ever needs to handle the failure case.
      if (!result.success) {
        setFormError(result.error);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-lg">
      {formError && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{formError}</p>
      )}

      <Field label="Room Name" error={fieldErrors.name}>
        <input
          name="name"
          defaultValue={initialRoom?.name}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Slug (used in the URL)" error={fieldErrors.slug}>
        <input
          name="slug"
          defaultValue={initialRoom?.slug}
          placeholder="ocean-view-suite"
          required
          className="w-full border rounded px-3 py-2 text-sm font-mono"
        />
      </Field>

      <Field label="Description" error={fieldErrors.description}>
        <textarea
          name="description"
          defaultValue={initialRoom?.description}
          rows={4}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Price / Night (₱)" error={fieldErrors.basePrice}>
          <input
            type="number"
            step="0.01"
            name="basePrice"
            defaultValue={initialRoom?.base_price}
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Capacity" error={fieldErrors.capacity}>
          <input
            type="number"
            name="capacity"
            defaultValue={initialRoom?.capacity}
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Total Units" error={fieldErrors.totalUnits}>
          <input
            type="number"
            name="totalUnits"
            defaultValue={initialRoom?.total_units}
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-slate-900 text-white rounded px-5 py-2.5 text-sm font-medium disabled:opacity-50"
      >
        {isPending ? "Saving..." : initialRoom ? "Save Changes" : "Create Room"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm text-slate-700 block mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error[0]}</p>}
    </div>
  );
}