export default function UsersLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-7 w-36 bg-zinc-100 rounded" />
          <div className="h-4 w-28 bg-zinc-100 rounded" />
        </div>
        <div className="h-10 w-36 bg-zinc-100 rounded-lg" />
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-zinc-100 shrink-0" />
              <div className="space-y-2">
                <div className="h-4 w-36 bg-zinc-100 rounded" />
                <div className="h-3 w-44 bg-zinc-100 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 bg-zinc-100 rounded-full" />
              <div className="h-8 w-8 bg-zinc-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
