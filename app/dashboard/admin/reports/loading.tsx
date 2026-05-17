export default function ReportsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-zinc-100 rounded-lg" />

      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-zinc-200 px-5 py-4 space-y-2">
            <div className="h-7 w-12 bg-zinc-100 rounded" />
            <div className="h-4 w-20 bg-zinc-100 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3">
        <div className="h-5 w-20 bg-zinc-100 rounded" />
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-9 bg-zinc-100 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="border-b border-zinc-100 bg-zinc-50 px-5 py-3 flex gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 w-20 bg-zinc-200 rounded" />
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-8 px-5 py-4 border-b border-zinc-100">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="h-4 bg-zinc-100 rounded" style={{ width: `${60 + j * 10}px` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
