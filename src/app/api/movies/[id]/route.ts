import { TMDB_API_KEY, TMDB_BASE_URL } from '@/lib/tmdb';

export async function GET(request: Request) {
  try {
    // Lấy id từ URL
    const url = new URL(request.url);
    const idMatch = url.pathname.match(/\/movies\/([^/]+)/);
    const id = idMatch ? idMatch[1] : null;
    if (!id) {
      return Response.json({ error: 'Movie ID is required' }, { status: 400 });
    }
    const language = url.searchParams.get('language') || 'en-US';

    // Gọi API TMDB để lấy thông tin chi tiết của phim
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=${language}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return Response.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
}