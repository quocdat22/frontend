import { Movie } from '@/types/movie';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatRating, formatReleaseDate, getPosterUrl } from '@/lib/tmdb';

interface MovieListProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
  children?: (movie: Movie) => React.ReactNode;
}

export function MovieList({ movies, onMovieClick, children }: MovieListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
          onClick={() => onMovieClick?.(movie)}
        >
          <div className="aspect-[2/3] bg-muted relative overflow-hidden">
            {movie.poster_path ? (
              <Image
                src={getPosterUrl(movie.poster_path) || ''}
                alt={movie.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="secondary" size="sm" className="rounded-full" asChild>
                <Link href={`/movies/${movie.id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                  View
                </Link>
              </Button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-1 truncate">{movie.title}</h3>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{formatReleaseDate(movie.release_date)}</p>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500 mr-1">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{formatRating(movie.vote_average)}</span>
              </div>
            </div>
            {children?.(movie)}
          </div>
        </div>
      ))}
    </div>
  );
} 