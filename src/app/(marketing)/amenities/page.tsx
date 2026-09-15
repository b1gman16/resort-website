import { getAmenities } from "@/lib/queries/amenities";
import { Sparkles } from "lucide-react";
import { ICON_MAP } from "@/lib/icon-map";

export default async function AmenitiesPage() {
  const amenities = await getAmenities();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-[content-fade-in_0.4s_ease-out]">
      <h1 className="text-3xl font-semibold text-slate-900 mb-2">Amenities</h1>
      <p className="text-slate-600 mb-10">Everything you need for a relaxed stay.</p>

      {amenities.length === 0 ? (
        <p className="text-slate-500">Amenities coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity) => {
            const Icon = (amenity.icon && ICON_MAP[amenity.icon]) || Sparkles;

            return (
              <div key={amenity.id} className="bg-white rounded-lg shadow-sm p-6">
                <Icon className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
                <h3 className="font-semibold text-slate-900 mt-3">{amenity.name}</h3>
                {amenity.description && (
                  <p className="text-sm text-slate-500 mt-1">{amenity.description}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}