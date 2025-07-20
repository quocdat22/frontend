import { Button } from '@/components/ui/button';

interface MoviePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function MoviePagination({ currentPage, totalPages, onPageChange }: MoviePaginationProps) {
  return (
    <div className="flex items-center gap-2 justify-center mt-8">
      <span className="text-muted-foreground">Page {currentPage} / {totalPages}</span>
      <div className="flex gap-2">
        {currentPage > 1 && (
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Button>
        )}
        {currentPage < totalPages && (
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
} 