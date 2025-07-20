'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatRating, formatReleaseDate, getPosterUrl } from '@/lib/tmdb';
import { Movie, MovieResponse } from '@/types/movie';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const pageParam = searchParams.get('page') || '1';
  const currentPage = parseInt(pageParam);
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  
  // Hàm tìm kiếm phim
  const searchMovies = async (searchTerm: string, page: number) => {
    if (!searchTerm.trim()) {
      setMovies([]);
      setTotalPages(0);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/movies/search?query=${encodeURIComponent(searchTerm)}&page=${page}`);
      
      if (!res.ok) {
        throw new Error(`Lỗi khi tìm kiếm phim: ${res.status}`);
      }
      
      const data: MovieResponse = await res.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Lỗi khi tìm kiếm phim:', err);
      setError('Không thể tìm kiếm phim. Vui lòng thử lại sau.');
      setMovies([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý khi người dùng submit form tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&page=1`);
    }
  };
  
  // Xử lý khi URL thay đổi
  useEffect(() => {
    if (query) {
      searchMovies(query, currentPage);
      setSearchQuery(query);
    }
  }, [query, currentPage]);
  
  // Xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/search?q=${encodeURIComponent(query)}&page=${newPage}`);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* <h1 className="text-3xl font-bold mb-8">Tìm kiếm phim</h1> */}
      
      {/* Form tìm kiếm */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2 max-w-2xl">
          <Input
            type="text"
            placeholder="Nhập tên phim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
          </Button>
        </div>
      </form>
      
      {/* Kết quả tìm kiếm */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {query && !loading && !error && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {movies.length > 0
              ? `Tìm thấy ${movies.length} kết quả cho "${query}"`
              : `Không tìm thấy kết quả nào cho "${query}"`}
          </p>
        </div>
      )}
      
      {/* Danh sách phim */}
      {movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          {movies.map((movie) => (
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
      )}
      
      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Button>
          
          <span className="px-4 py-2 text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}