"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Movie } from '@/types/movie';
import { MovieList } from './MovieList';
import { MoviePagination } from './MoviePagination';

interface Props {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
}

export function PopularMoviesSection({ movies, currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <MovieList movies={movies} />
      <MoviePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
} 