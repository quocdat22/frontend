export default function MovieDetailLoading() {
  return (
    <>
      {/* Movie Hero Section Skeleton */}
      <section className="relative">
        {/* Backdrop Image Skeleton */}
        <div className="w-full h-[50vh] md:h-[70vh] relative overflow-hidden bg-muted animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20"></div>
        </div>
        
        {/* Movie Info Skeleton */}
        <div className="container mx-auto px-4 relative z-20 -mt-32 md:-mt-48">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster Skeleton */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="aspect-[2/3] bg-muted rounded-lg shadow-xl animate-pulse"></div>
            </div>
            
            {/* Details Skeleton */}
            <div className="flex-1 bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-lg">
              <div className="h-10 bg-muted rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-1/2 mb-6 animate-pulse"></div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-6 bg-muted rounded-full w-20 animate-pulse"></div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index}>
                    <div className="h-4 bg-muted rounded w-16 mb-1 animate-pulse"></div>
                    <div className="h-5 bg-muted rounded w-20 animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <div className="h-6 bg-muted rounded w-32 mb-2 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="h-10 bg-muted rounded-full w-32 animate-pulse"></div>
                <div className="h-10 bg-muted rounded-full w-48 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional Movie Info Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow animate-pulse">
                <div className="h-6 bg-muted rounded w-48 mb-4"></div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded w-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}