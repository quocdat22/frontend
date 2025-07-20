'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Movie } from '@/types/movie';
import { MovieList } from '@/components/MovieList';


export default function MoviesByCountryPage() {
  const searchParams = useSearchParams();
  const country = searchParams.get('country') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!country) return;
    setLoading(true);
    setError('');
    fetch(`/api/movies/by-country?country=${country}`)
      .then(res => {
        if (!res.ok) throw new Error('Không thể tải phim');
        return res.json();
      })
      .then(data => setMovies(data.results || []))
      .catch(() => setError('Không thể tải phim'))
      .finally(() => setLoading(false));
  }, [country]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Phim theo quốc gia</h1>
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-destructive mb-4">{error}</div>}
      {!loading && !error && <MovieList movies={movies} />}
      {!loading && !error && movies.length === 0 && (
        <div className="text-muted-foreground">Không có phim nào cho quốc gia này.</div>
      )}
    </div>
  );
} 