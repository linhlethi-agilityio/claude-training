export const OnboardingSkeleton = () => (
  <div className="flex flex-col gap-7 animate-pulse">
    <div className="flex flex-col gap-2">
      <div className="h-2 w-16 rounded bg-gray-200" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-12 rounded-lg bg-gray-200" />
      ))}
    </div>

    <div className="h-11 rounded-md bg-gray-200" />
  </div>
);
