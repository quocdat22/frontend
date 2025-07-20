import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TMDB_API_KEY, TMDB_BASE_URL, formatRating, formatReleaseDate, getBackdropUrl, getPosterUrl } from '@/lib/tmdb';

async function getMovieDetails(id: string) {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 3600 } } // Cache trong 1 giờ
    );
    
    if (!res.ok) {
      throw new Error(`Failed to fetch movie details. Status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error loading movie details for ID ${id}:`, error);
    return null;
  }
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);
  
  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="p-12 text-center bg-card rounded-xl shadow-xl max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Không tìm thấy phim</h1>
          <p className="text-muted-foreground mb-6">Không thể tải thông tin phim hoặc phim không tồn tại.</p>
          <Button asChild>
            <Link href="/">Quay lại trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Movie Hero Section */}
      <section className="relative">
        {/* Backdrop Image */}
        <div className="w-full h-[50vh] md:h-[70vh] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20 z-10"></div>
          {movie.backdrop_path ? (
            <Image 
              src={getBackdropUrl(movie.backdrop_path, 'original') || ''}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-xl">Không có ảnh nền</span>
            </div>
          )}
        </div>
        
        {/* Movie Info */}
        <div className="container mx-auto px-4 relative z-20 -mt-32 md:-mt-48">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="aspect-[2/3] bg-card rounded-lg shadow-xl overflow-hidden relative">
                {movie.poster_path ? (
                  <Image 
                    src={getPosterUrl(movie.poster_path, 'w500') || ''}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">Không có poster</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Details */}
            <div className="flex-1 bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-lg italic text-muted-foreground mb-4">&quot;{movie.tagline}&quot;</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre: { id: number, name: string }) => (
                  <span key={genre.id} className="px-3 py-1 bg-primary/10 text-primary-foreground rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Năm phát hành</h3>
                  <p>{formatReleaseDate(movie.release_date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Đánh giá</h3>
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500 mr-1">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    {formatRating(movie.vote_average)} ({movie.vote_count} đánh giá)
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Thời lượng</h3>
                  <p>{movie.runtime} phút</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Ngôn ngữ</h3>
                  <p>{movie.original_language?.toUpperCase()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Tóm tắt</h3>
                <p className="text-foreground/90">{movie.overview || 'Không có mô tả.'}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="rounded-full px-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                  Xem phim
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
                  Thêm vào danh sách
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional Movie Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Production Companies */}
            <div className="bg-card p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Công ty sản xuất</h2>
              {movie.production_companies && movie.production_companies.length > 0 ? (
                <ul className="space-y-2">
                  {movie.production_companies.map((company: { id: number, name: string }) => (
                    <li key={company.id}>{company.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Không có thông tin</p>
              )}
            </div>
            
            {/* Production Countries */}
            <div className="bg-card p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Quốc gia sản xuất</h2>
              {movie.production_countries && movie.production_countries.length > 0 ? (
                <ul className="space-y-2">
                  {movie.production_countries.map((country: { iso_3166_1: string, name: string }) => (
                    <li key={country.iso_3166_1}>{country.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Không có thông tin</p>
              )}
            </div>
            
            {/* Additional Info */}
            <div className="bg-card p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Thông tin thêm</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground">Ngân sách: </span>
                  <span>{movie.budget ? `$${movie.budget.toLocaleString()}` : 'Không có thông tin'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Doanh thu: </span>
                  <span>{movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'Không có thông tin'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Trạng thái: </span>
                  <span>{movie.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Độ phổ biến: </span>
                  <span>{movie.popularity?.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}