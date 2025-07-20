import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MovieResponse, Movie } from "@/types/movie";
import { formatRating, formatReleaseDate, getBackdropUrl, getPosterUrl, TMDB_API_KEY, TMDB_BASE_URL } from "@/lib/tmdb";
import { Carousel, CarouselItem, CarouselPrevButton, CarouselNextButton } from "@/components/ui/carousel";
import { MovieList } from '@/components/MovieList';
import { MoviePagination } from '@/components/MoviePagination';
import { PopularMoviesSection } from '@/components/PopularMoviesSection';
import { PopularMoviesInfinite } from '@/components/PopularMoviesInfinite';
import { redirect } from 'next/navigation';

async function getPopularMovies(page = 1) {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
      { next: { revalidate: 3600 } } // Cache trong 1 giờ
    );
    
    if (!res.ok) {
      throw new Error('Failed to fetch popular movies');
    }
    
    const data: MovieResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error loading popular movies:', error);
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }
}

export default async function Home(props: { searchParams?: { page?: string } }) {
  const currentPage = Number(props.searchParams?.page) > 0 ? Number(props.searchParams?.page) : 1;
  const moviesData = await getPopularMovies(currentPage);
  const movies = moviesData.results;
  const totalPages = moviesData.total_pages || 1;

  // Lấy 5 phim đầu tiên làm phim nổi bật
  const featuredMovies = movies.length > 0 ? movies.slice(0, 5) : [];

  // Hàm xử lý chuyển trang (chỉ dùng cho client component, ở đây chỉ truyền prop)
  // onPageChange sẽ được xử lý ở client bằng useRouter hoặc Link

  return (
    <>
      {/* Featured Movies Carousel */}
      <section>
        {featuredMovies.length > 0 ? (
          <div className="relative overflow-hidden">
            <Carousel autoplay={true} delayMs={6000}>
              {featuredMovies.map((movie) => (
                <CarouselItem key={movie.id}>
                  {/* Movie Banner Image */}
                  <div className="aspect-[21/9] bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                    {movie.backdrop_path ? (
                      <Image 
                        src={getBackdropUrl(movie.backdrop_path) || ''}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-card/20">
                        <span className="text-muted-foreground text-xl">Không có ảnh nền</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Movie Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                      {/* Movie Poster */}
                      <div className="w-32 h-48 bg-card rounded-lg shadow-lg hidden md:block relative overflow-hidden">
                        {movie.poster_path ? (
                          <Image 
                            src={getPosterUrl(movie.poster_path) || ''}
                            alt={movie.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">Không có poster</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Movie Details */}
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">{movie.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {/* Thể loại sẽ được thêm sau khi có API lấy thể loại */}
                          <span className="px-2 py-1 bg-primary/20 text-primary-foreground rounded text-xs">
                            {formatReleaseDate(movie.release_date)}
                          </span>
                          <span className="px-2 py-1 bg-primary/20 text-primary-foreground rounded text-xs">
                            ⭐ {formatRating(movie.vote_average)}
                          </span>
                        </div>
                        <p className="text-white/80 mb-4 max-w-2xl line-clamp-2 md:line-clamp-3">{movie.overview || 'Không có mô tả.'}</p>
                        <div className="flex flex-wrap gap-3">
                          <Button size="lg" className="rounded-full px-6" asChild>
                            <Link href={`/movies/${movie.id}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                              </svg>
                              Xem ngay
                            </Link>
                          </Button>
                          <Button variant="outline" size="lg" className="rounded-full px-6 bg-white/10 hover:bg-white/20 border-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                            </svg>
                            Thêm vào danh sách
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className="p-12 text-center bg-card rounded-xl shadow-xl max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Không thể tải phim nổi bật</h3>
            <p className="text-muted-foreground">Vui lòng thử lại sau.</p>
          </div>
        )}
      </section>
      {/* Movies List Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Danh sách phim phổ biến</h2>
          </div>
          <PopularMoviesInfinite />
        </div>
      </section>
    </>
  );
}
