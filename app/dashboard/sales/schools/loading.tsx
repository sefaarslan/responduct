export default function SchoolsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-28 bg-zinc-100 rounded" />
        <div className="h-4 w-32 bg-zinc-100 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-zinc-100 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-zinc-100 rounded" />
                <div className="h-3 w-1/2 bg-zinc-100 rounded" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-zinc-100 rounded" />
              <div className="h-3 w-2/3 bg-zinc-100 rounded" />
            </div>
            <div className="flex gap-1.5">
              <div className="h-5 w-16 bg-zinc-100 rounded-full" />
              <div className="h-5 w-20 bg-zinc-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
