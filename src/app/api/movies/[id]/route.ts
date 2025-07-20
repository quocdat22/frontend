import { NextResponse } from 'next/server';
import { TMDB_API_KEY, TMDB_BASE_URL } from '@/lib/tmdb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'vi-VN';

    // Gọi API TMDB để lấy thông tin chi tiết của phim
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=${language}`,
      { next: { revalidate: 3600 } } // Cache trong 1 giờ
    );

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching movie with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
}