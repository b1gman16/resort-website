import Link from "next/link";
import Image from "next/image";
import type { RoomWithImages } from "@/lib/queries/rooms";
import { getRoomImageUrl } from "@/lib/utils/storage";

export function RoomCard({ room }: { room: RoomWithImages }) {
  // Rooms may not have an image yet (e.g. newly added, or Storage setup
  // pending) — fall back to a plain placeholder block instead of letting
  // a broken image icon show, which looks unfinished/broken to a visitor.
  const primaryImage = room.room_images[0];
  const imageUrl = primaryImage ? getRoomImageUrl(primaryImage.storage_path) : null;

  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-slate-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={primaryImage?.alt_text ?? room.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            No image yet
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{room.name}</h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{room.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-900">
            ₱{room.base_price.toLocaleString()}
            <span className="text-sm font-normal text-slate-500"> / night</span>
          </span>
          <span className="text-xs text-slate-500">Up to {room.capacity} guests</span>
        </div>
      </div>
    </Link>
  );
}