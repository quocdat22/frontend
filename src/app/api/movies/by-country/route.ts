import { NextResponse } from 'next/server';
import { TMDB_API_KEY, TMDB_BASE_URL } from '@/lib/tmdb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const page = searchParams.get('page') || '1';
    if (!country) {
      return NextResponse.json({ error: 'Country parameter is required' }, { status: 400 });
    }
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_origin_country=${country}&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch movies by country');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching movies by country:', error);
    return NextResponse.json({ error: 'Failed to fetch movies by country' }, { status: 500 });
  }
} 