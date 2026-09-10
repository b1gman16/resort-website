import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRoomBySlug } from "@/lib/queries/rooms";
import { getRoomImageUrl } from "@/lib/utils/storage";
import Image from "next/image";
import Link from "next/link";

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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link href="/rooms" className="text-sm text-slate-500 hover:underline">
        ← Back to Rooms
      </Link>

      <h1 className="text-3xl font-semibold text-slate-900 mt-4">{room.name}</h1>

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
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
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-2">About this room</h2>
          <p className="text-slate-600 whitespace-pre-line">{room.description}</p>
        </div>

        {/* sticky top-24: follows scroll, held ~96px below the sticky navbar
            rather than pinned to the very top edge (which would sit flush
            against the navbar with no breathing room). h-fit keeps its
            height to its own content, not stretched to match the
            description column. It naturally stops scrolling once it
            reaches the bottom of this grid row — it can't float past the
            end of the room's content into the footer. */}
        <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24 self-start">
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
      </div>
    </div>
  );
}