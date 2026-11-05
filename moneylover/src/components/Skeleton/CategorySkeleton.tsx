export const CategorySkeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    <div className="flex gap-2 rounded-lg bg-gray-200 p-1">
      <div className="h-9 flex-1 rounded-md bg-gray-300" />
      <div className="h-9 flex-1 rounded-md bg-gray-100" />
    </div>

    <div className="h-10 rounded-md bg-gray-200" />

    <div className="rounded-lg border border-gray-200 bg-white">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  </div>
);
