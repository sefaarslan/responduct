export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-zinc-100 rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
            <div className="h-9 w-9 rounded-lg bg-zinc-100" />
            <div className="space-y-2">
              <div className="h-7 w-16 bg-zinc-100 rounded" />
              <div className="h-4 w-24 bg-zinc-100 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-zinc-200 p-8">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-zinc-100 rounded w-full" style={{ width: `${85 - i * 8}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
