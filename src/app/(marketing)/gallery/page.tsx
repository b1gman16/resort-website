import { getGalleryImages } from "@/lib/queries/gallery";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-[content-fade-in_0.4s_ease-out]">
      <h1 className="text-3xl font-semibold text-slate-900 mb-2">Gallery</h1>
      <p className="text-slate-600 mb-8">A look around the resort.</p>

      {images.length === 0 ? (
        <p className="text-slate-500">Photos coming soon.</p>
      ) : (
        <GalleryGrid images={images} />
      )}
    </div>
  );
}