export const TransactionSkeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="h-8 rounded bg-gray-200" />
      <div className="mt-3 space-y-2">
        <div className="flex justify-between">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>
      </div>
    </div>

    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>
        {Array.from({ length: 2 }).map((_, j) => (
          <div key={j} className="flex items-center gap-4 px-4 py-3">
            <div className="h-8 w-8 rounded bg-gray-200" />
            <div className="flex-1 space-y-1">
              <div className="h-3.5 w-40 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-200" />
            </div>
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    ))}
  </div>
);
