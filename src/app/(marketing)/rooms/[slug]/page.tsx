import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRoomBySlug } from "@/lib/queries/rooms";
import { getRoomImageUrl } from "@/lib/utils/storage";
import Image from "next/image";
import { Link } from "next-view-transitions";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);

  if (!room) {
    return { title: "Room Not Found" };
  }

  return {
    title: `${room.name} — Resort Website`,
    description: room.description.slice(0, 160),
  };
}

export default async function RoomDetailPage({ params }: Props) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);

  if (!room) {
    notFound();
  }

  const images = room.room_images.sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-[content-fade-in_0.4s_ease-out]">
      <Link href="/rooms" className="text-sm text-slate-500 hover:underline">
        ← Back to Rooms
      </Link>

      <h1 className="text-3xl font-semibold text-slate-900 mt-4">{room.name}</h1>

      {/* Two columns from md up: photos on the left (wider), a combined
          info + booking sidebar on the right. On mobile this collapses to
          a single stacked column in source order — photos, then sidebar. */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Photos — main column */}
        <div className="md:col-span-2">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-200 ${
                    i === 0 ? "sm:col-span-2 aspect-[16/9]" : ""
                  }`}
                >
                  <Image
                    src={getRoomImageUrl(img.storage_path)}
                    alt={img.alt_text ?? room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-[16/9] rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
              Photos coming soon
            </div>
          )}
        </div>

        {/* Sidebar — description AND price/booking together, so a guest
            never has to scroll past photos to find either one.
            sticky top-24: on a room with many photos (making the left
            column tall), this still follows the scroll so it stays
            visible; items-start on the parent grid (above) is required
            for sticky to work correctly inside a grid row — without it,
            this column stretches to match the photo column's height and
            sticky has no room to move within its own box. */}
        <div className="md:col-span-1 sticky top-24 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-2xl font-semibold text-slate-900">
              ₱{room.base_price.toLocaleString()}
              <span className="text-sm font-normal text-slate-500"> / night</span>
            </p>
            <p className="text-sm text-slate-500 mt-1">Up to {room.capacity} guests</p>

            <Link
              href={`/book?room=${room.id}`}
              className="mt-4 block text-center bg-slate-900 text-white rounded py-2 text-sm font-medium hover:bg-slate-800"
            >
              Book This Room
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-2">About this room</h2>
            <p className="text-slate-600 text-sm whitespace-pre-line">{room.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}