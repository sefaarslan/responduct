export default function SchoolsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-7 w-24 bg-zinc-100 rounded" />
          <div className="h-4 w-32 bg-zinc-100 rounded" />
        </div>
        <div className="h-10 w-32 bg-zinc-100 rounded-lg" />
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4">
            <div className="space-y-2">
              <div className="h-4 w-48 bg-zinc-100 rounded" />
              <div className="h-3 w-32 bg-zinc-100 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-zinc-100 rounded-lg" />
              <div className="h-8 w-16 bg-zinc-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
