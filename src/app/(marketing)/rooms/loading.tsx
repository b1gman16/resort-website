import { Skeleton } from "@/components/ui/skeleton";

export default function RoomsLoading() {
  return (
    <div>
      <div className="min-h-[70vh] bg-[var(--color-sand)] flex items-end">
        <div className="max-w-6xl mx-auto px-6 pb-20 w-full">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-14 w-2/3" />
        </div>
      </div>

      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-[4/5] md:h-[70vh] w-full" />
          <div>
            <Skeleton className="h-5 w-20 mb-3" />
            <Skeleton className="h-10 w-3/4 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}