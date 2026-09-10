import { getAmenities } from "@/lib/queries/amenities";
import { Waves, Wifi, Sparkles, Utensils, Car, Dumbbell, type LucideIcon } from "lucide-react";

// Maps the icon string stored in the DB to an actual Lucide component.
// This mapping is the one place that needs updating any time a new
// amenity introduces a new icon name — keeps the rest of the page (and
// the database) decoupled from which specific icon library is in use.
const ICON_MAP: Record<string, LucideIcon> = {
  waves: Waves,
  wifi: Wifi,
  sparkles: Sparkles,
  utensils: Utensils,
  car: Car,
  dumbbell: Dumbbell,
};

export default async function AmenitiesPage() {
  const amenities = await getAmenities();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-slate-900 mb-2">Amenities</h1>
      <p className="text-slate-600 mb-10">Everything you need for a relaxed stay.</p>

      {amenities.length === 0 ? (
        <p className="text-slate-500">Amenities coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity) => {
            // Falls back to a generic icon rather than crashing if the DB
            // ever has an icon name not yet added to ICON_MAP — a content
            // mistake shouldn't be able to break the page.
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