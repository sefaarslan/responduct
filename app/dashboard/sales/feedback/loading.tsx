export default function FeedbackLoading() {
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-pulse py-2">
      <div className="h-2 bg-zinc-100 rounded-full" />

      <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
        <div className="h-5 w-40 bg-zinc-100 rounded" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-zinc-100 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="h-10 w-24 bg-zinc-100 rounded-lg" />
        <div className="h-10 w-32 bg-zinc-100 rounded-lg" />
      </div>
    </div>
  );
}
