export default function BrandSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg shadow-sm animate-pulse bg-white">
      <div className="flex items-start sm:items-center gap-4 flex-1">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-56 bg-gray-100 rounded" />
          <div className="h-3 w-32 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="sm:ml-auto w-24 h-8 bg-gray-200 rounded" />
    </div>
  );
}
