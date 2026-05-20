export default function SalesOverviewLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-zinc-100 rounded" />
          <div className="h-4 w-48 bg-zinc-100 rounded" />
        </div>
        <div className="h-10 w-36 bg-zinc-100 rounded-lg" />
      </div>

      <div className="space-y-3">
        <div className="h-4 w-28 bg-zinc-100 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-zinc-200 p-4 h-16" />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-4 w-28 bg-zinc-100 rounded" />
        <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div className="space-y-2">
                <div className="h-4 w-36 bg-zinc-100 rounded" />
                <div className="h-3 w-24 bg-zinc-100 rounded" />
              </div>
              <div className="h-5 w-20 bg-zinc-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
