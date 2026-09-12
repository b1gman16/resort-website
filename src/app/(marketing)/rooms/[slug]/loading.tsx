import { Skeleton } from "@/components/ui/skeleton";

export default function RoomDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-9 w-64 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="aspect-[16/9] w-full sm:col-span-2" />
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="aspect-[4/3] w-full" />
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}