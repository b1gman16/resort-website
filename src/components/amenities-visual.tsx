import { Sparkles } from "lucide-react";
import { ICON_MAP } from "@/lib/icon-map";
import type { Amenity } from "@/lib/queries/amenities";

export function AmenitiesVisual({ amenities }: { amenities: Amenity[] }) {
  return (
    <div className="w-full h-full bg-[var(--color-tide)] flex items-center justify-center p-10">
      <div className="grid grid-cols-2 gap-10">
        {amenities.slice(0, 4).map((amenity) => {
          const Icon = (amenity.icon && ICON_MAP[amenity.icon]) || Sparkles;
          return (
            <div key={amenity.id} className="text-[var(--color-foam)] text-center">
              <Icon className="w-7 h-7 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs">{amenity.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}