export const HomeSkeleton = () => (
  <div className="mx-auto max-w-2xl flex flex-col gap-6 p-6 animate-pulse">
    <div className="rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="h-5 w-40 rounded bg-gray-200" />
        <div className="h-4 w-12 rounded bg-gray-200" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0"
        >
          <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-3 w-24 rounded bg-gray-200" />
          </div>
          <div className="h-4 w-20 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  </div>
);
