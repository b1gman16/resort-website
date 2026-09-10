"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { getRoomImageUrl } from "@/lib/utils/storage";
import { uploadRoomImage, deleteRoomImage, moveImage } from "@/app/admin/(protected)/rooms/[id]/edit/image-actions";

type RoomImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  display_order: number;
};

export function RoomImageManager({
  roomId,
  roomSlug,
  initialImages,
}: {
  roomId: string;
  roomSlug: string;
  initialImages: RoomImage[];
}) {
  const [images, setImages] = useState(
    [...initialImages].sort((a, b) => a.display_order - b.display_order)
  );
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUpload(formData: FormData) {
    setUploadError(null);
    startTransition(async () => {
      const result = await uploadRoomImage(roomId, roomSlug, formData);
      if (!result.success) {
        setUploadError(result.error);
        return;
      }
      // Full reload is simplest here — image lists don't change often
      // enough for this route to be worth optimizing away, unlike the
      // higher-frequency booking/message updates elsewhere in the app.
      window.location.reload();
    });
  }

  function handleDelete(image: RoomImage) {
    if (!confirm("Remove this image?")) return;
    startTransition(async () => {
      const result = await deleteRoomImage(image.id, image.storage_path, roomId, roomSlug);
      if (result.success) {
        setImages((prev) => prev.filter((img) => img.id !== image.id));
      }
    });
  }

  function handleMove(index: number, direction: "up" | "down") {
    const siblingIndex = direction === "up" ? index - 1 : index + 1;
    if (siblingIndex < 0 || siblingIndex >= images.length) return;

    const current = images[index];
    const sibling = images[siblingIndex];

    startTransition(async () => {
      await moveImage(
        current.id,
        direction,
        current.display_order,
        sibling.id,
        sibling.display_order,
        roomId
      );
    });

    // Optimistic local reorder — swap positions immediately in the UI
    // rather than waiting on the round-trip.
    const next = [...images];
    [next[index], next[siblingIndex]] = [next[siblingIndex], next[index]];
    setImages(next);
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="font-semibold text-slate-900 mb-4">Photos</h2>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {images.map((image, i) => (
            <div key={image.id} className="relative">
              <div className="relative aspect-square rounded overflow-hidden bg-slate-200">
                <Image
                  src={getRoomImageUrl(image.storage_path)}
                  alt={image.alt_text ?? ""}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMove(i, "up")}
                    disabled={i === 0 || isPending}
                    className="text-xs px-1 text-slate-500 disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => handleMove(i, "down")}
                    disabled={i === images.length - 1 || isPending}
                    className="text-xs px-1 text-slate-500 disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(image)}
                  disabled={isPending}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        action={(formData) => {
          handleUpload(formData);
          fileInputRef.current?.value && (fileInputRef.current.value = "");
        }}
        className="flex items-end gap-3 flex-wrap"
      >
        {uploadError && (
          <p className="w-full text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
            {uploadError}
          </p>
        )}
        <div>
          <label className="text-xs text-slate-600 block mb-1">New photo</label>
          <input ref={fileInputRef} type="file" name="file" accept="image/*" required />
        </div>
        <div>
          <label className="text-xs text-slate-600 block mb-1">Alt text (optional)</label>
          <input
            name="altText"
            placeholder="Describes the photo"
            className="border rounded px-2 py-1.5 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-slate-900 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
        >
          {isPending ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}