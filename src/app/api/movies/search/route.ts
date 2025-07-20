import { NextResponse } from 'next/server';
import { TMDB_API_KEY, TMDB_BASE_URL } from '@/lib/tmdb';
import { MovieResponse } from '@/types/movie';

export async function GET(request: Request) {
  try {
    // Lấy tham số từ URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = searchParams.get('page') || '1';
    const language = searchParams.get('language') || 'en-US';
    
    // Kiểm tra xem có query không
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    // Gọi API TMDB để tìm kiếm phim
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=${language}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`,
      { next: { revalidate: 3600 } } // Cache trong 1 giờ
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`);
    }
    
    const data: MovieResponse = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching movies:', error);
    return NextResponse.json(
      { error: 'Failed to search movies' },
      { status: 500 }
    );
  }
}