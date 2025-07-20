export default function MoviesLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-pulse">
        <div>
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="h-9 bg-muted rounded w-32"></div>
        </div>
      </div>
      
      {/* Movie Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="bg-card rounded-lg overflow-hidden shadow-md animate-pulse">
            <div className="aspect-[2/3] bg-muted"></div>
            <div className="p-4">
              <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}