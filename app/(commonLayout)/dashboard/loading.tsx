import { Skeleton } from "@/components/ui/skeleton";

const DashboardLoading = () => {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 p-4 space-y-4"
            >
              <Skeleton className="h-4 w-32 bg-white/5" />
              <Skeleton className="h-8 w-20 bg-white/5" />
              <Skeleton className="h-6 w-24 bg-white/5" />
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-2/3 bg-white/5" />
            </div>
          ))}
        </div>
        <div className="px-4 lg:px-6">
          <div className="rounded-xl border border-white/10 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 bg-white/5" />
                <Skeleton className="h-4 w-28 bg-white/5" />
              </div>
              <Skeleton className="h-8 w-40 bg-white/5" />
            </div>

            <Skeleton className="h-62.5 w-full rounded-lg bg-white/5" />
          </div>
        </div>
        <div className="w-full flex-col gap-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <Skeleton className="h-10 w-100 bg-white/5" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-48 bg-white/5" />
              <Skeleton className="h-8 w-20 bg-white/5" />
            </div>
          </div>

          <div className="px-4 lg:px-6 space-y-4">
            <div className="rounded-md border border-white/10">
              <div className="p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-4 w-10 bg-white/5" />
                    <Skeleton className="h-4 w-40 bg-white/5" />
                    <Skeleton className="h-4 w-32 bg-white/5" />
                    <Skeleton className="h-4 w-24 bg-white/5" />
                    <Skeleton className="h-4 w-20 bg-white/5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-4">
              <Skeleton className="h-4 w-48 bg-white/5" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 bg-white/5" />
                <Skeleton className="h-8 w-24 bg-white/5" />
                <Skeleton className="h-8 w-32 bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
