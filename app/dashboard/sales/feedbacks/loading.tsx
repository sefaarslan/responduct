export default function FeedbacksLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-40 bg-zinc-100 rounded" />
        <div className="h-4 w-20 bg-zinc-100 rounded" />
      </div>
      <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="h-4 w-4 bg-zinc-100 rounded-full shrink-0" />
              <div className="space-y-2">
                <div className="h-4 w-36 bg-zinc-100 rounded" />
                <div className="h-3 w-24 bg-zinc-100 rounded" />
              </div>
            </div>
            <div className="h-5 w-20 bg-zinc-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
