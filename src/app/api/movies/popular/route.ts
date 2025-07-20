import { NextResponse } from 'next/server';
import { TMDB_API_KEY, TMDB_BASE_URL } from '@/lib/tmdb';
import { MovieResponse } from '@/types/movie';

export async function GET(request: Request) {
  try {
    // Lấy tham số từ URL (nếu có)
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const language = searchParams.get('language') || 'vi-VN';

    // Gọi API TMDB để lấy danh sách phim phổ biến
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
      { next: { revalidate: 3600 } } // Cache trong 1 giờ
    );

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`);
    }

    const data: MovieResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular movies' },
      { status: 500 }
    );
  }
}