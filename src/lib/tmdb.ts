// Các hằng số cho TMDB API
export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Kích thước ảnh
export const posterSizes = {
  w92: 'w92',
  w154: 'w154',
  w185: 'w185',
  w342: 'w342',
  w500: 'w500',
  w780: 'w780',
  original: 'original',
};

export const backdropSizes = {
  w300: 'w300',
  w780: 'w780',
  w1280: 'w1280',
  original: 'original',
};

// Hàm tạo URL cho ảnh poster
export function getPosterUrl(path: string | null, size: keyof typeof posterSizes = 'w500'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${posterSizes[size]}${path}`;
}

// Hàm tạo URL cho ảnh backdrop
export function getBackdropUrl(path: string | null, size: keyof typeof backdropSizes = 'w1280'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${backdropSizes[size]}${path}`;
}

// Hàm định dạng ngày phát hành
export function formatReleaseDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

// Hàm định dạng điểm đánh giá
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}