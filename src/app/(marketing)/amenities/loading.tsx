import { Skeleton } from "@/components/ui/skeleton";

export default function AmenitiesLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Skeleton className="h-9 w-48 mb-2" />
      <Skeleton className="h-5 w-72 mb-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton className="w-6 h-6 mb-3" />
            <Skeleton className="h-5 w-2/3 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}