import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TMDB_API_KEY, TMDB_BASE_URL, formatRating, formatReleaseDate, getPosterUrl } from '@/lib/tmdb';
import { Movie, MovieResponse } from '@/types/movie';

async function getPopularMovies(page = 1) {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=vi-VN&page=${page}`,
      { next: { revalidate: 3600 } } // Cache trong 1 giờ
    );
    
    if (!res.ok) {
      throw new Error(`Failed to fetch popular movies. Status: ${res.status}`);
    }
    
    const data: MovieResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error loading popular movies:', error);
    return { results: [], total_pages: 0, total_results: 0, page: 1 };
  }
}

// Đánh dấu component là dynamic để tránh lỗi với searchParams
export const dynamic = 'force-dynamic';

// Sử dụng kiểu dữ liệu cụ thể cho searchParams
type SearchParams = { page?: string };

export default async function MoviesPage({ 
  searchParams 
}: { 
  searchParams: SearchParams
}) {
  // Trong Next.js 15, không truy cập trực tiếp vào thuộc tính của searchParams
  // Sử dụng giá trị mặc định là 1
  const currentPage = 1;
  const moviesData = await getPopularMovies(currentPage);
  
  // Tính toán thông tin phân trang
  const totalPages = moviesData.total_pages || 0;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Phim Phổ Biến</h1>
          <p className="text-muted-foreground">Khám phá những bộ phim được yêu thích nhất hiện nay</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="text-muted-foreground">Trang {currentPage}/{totalPages}</span>
          <div className="flex gap-2">
            {hasPrevPage && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/movies?page=${currentPage - 1}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </Link>
              </Button>
            )}
            {hasNextPage && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/movies?page=${currentPage + 1}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {moviesData.results?.map((movie: Movie) => (
          <Link 
            href={`/movies/${movie.id}`} 
            key={movie.id}
            className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            <div className="aspect-[2/3] relative overflow-hidden">
              {movie.poster_path ? (
                <Image 
                  src={getPosterUrl(movie.poster_path) || ''}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Không có ảnh</span>
                </div>
              )}
              
              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded text-xs font-medium">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-500 mr-1">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  {formatRating(movie.vote_average)}
                </div>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors">{movie.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{formatReleaseDate(movie.release_date)}</p>
              
              <div className="mt-auto">
                <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto hover:bg-transparent group-hover:text-primary transition-colors">
                  <span>Xem chi tiết</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Mobile Pagination */}
      <div className="mt-8 flex justify-center gap-2 md:hidden">
        {hasPrevPage && (
          <Button variant="outline" asChild>
            <Link href={`/movies?page=${currentPage - 1}`}>Trang trước</Link>
          </Button>
        )}
        {hasNextPage && (
          <Button variant="outline" asChild>
            <Link href={`/movies?page=${currentPage + 1}`}>Trang sau</Link>
          </Button>
        )}
      </div>
    </div>
  );
}