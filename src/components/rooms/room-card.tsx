import { Link } from "next-view-transitions";
import Image from "next/image";
import type { RoomWithImages } from "@/lib/queries/rooms";
import { getRoomImageUrl } from "@/lib/utils/storage";

export function RoomCard({ room }: { room: RoomWithImages }) {
  const primaryImage = room.room_images[0];
  const imageUrl = primaryImage ? getRoomImageUrl(primaryImage.storage_path) : null;

  return (
    <Link
      href={`/rooms/${room.slug}`}
      // group: lets children (image, shadow) react to hover on this
      // outer element, not just their own individual hover state.
      // -translate-y-1.5: the whole card lifts slightly on hover.
      className="group block transition-transform duration-300 hover:-translate-y-1.5"
    >
      <div className="relative aspect-[4/3] bg-[var(--color-sand)] overflow-hidden rounded-sm shadow-sm group-hover:shadow-xl transition-shadow duration-300">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={primaryImage?.alt_text ?? room.name}
            fill
            className="object-cover group-hover:scale-[1.05] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-ink)]/40 text-sm">
            Photo coming soon
          </div>
        )}
      </div>
      <div className="pt-4">
        <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-tide)] group-hover:text-[var(--color-brass)] transition-colors duration-300">
          {room.name}
        </h3>
        <p className="text-sm text-[var(--color-ink)]/70 mt-1 line-clamp-2">
          {room.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-[var(--color-brass)] font-medium">
            ₱{room.base_price.toLocaleString()} / night
          </span>
          <span className="text-[var(--color-ink)]/50">Up to {room.capacity} guests</span>
        </div>
      </div>
    </Link>
  );
}