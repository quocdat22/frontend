"use client";

import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';
import { MovieList } from './MovieList';
import { Button } from '@/components/ui/button';

async function fetchMovies(page: number): Promise<{ results: Movie[], total_pages: number }> {
  const res = await fetch(`/api/movies/popular?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}

export function PopularMoviesInfinite() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMovies(page)
      .then(data => {
        setMovies(prev => page === 1 ? data.results : [...prev, ...data.results]);
        setTotalPages(data.total_pages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handleLoadMore = () => setPage(p => p + 1);

  return (
    <div>
      <MovieList movies={movies} />
      {page < totalPages && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  );
} 