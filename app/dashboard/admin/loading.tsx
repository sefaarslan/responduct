export default function AdminOverviewLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-36 bg-zinc-100 rounded" />
        <div className="h-4 w-56 bg-zinc-100 rounded" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
            <div className="h-9 w-9 rounded-lg bg-zinc-100" />
            <div className="space-y-1.5">
              <div className="h-7 w-12 bg-zinc-100 rounded" />
              <div className="h-4 w-20 bg-zinc-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-4 w-28 bg-zinc-100 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-zinc-200 p-5 space-y-2">
              <div className="h-4 w-28 bg-zinc-100 rounded" />
              <div className="h-3 w-36 bg-zinc-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
