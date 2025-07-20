import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Về Movie Web App</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Giới thiệu</h2>
            <p className="text-muted-foreground mb-4">
              Movie Web App là một ứng dụng web hiện đại được xây dựng để giúp người dùng khám phá và tìm kiếm thông tin về các bộ phim. 
              Ứng dụng sử dụng dữ liệu từ The Movie Database (TMDB) API để cung cấp thông tin phim mới nhất và chính xác nhất.
            </p>
            <p className="text-muted-foreground">
              Với giao diện người dùng trực quan và thân thiện, Movie Web App giúp bạn dễ dàng tìm kiếm, duyệt và khám phá các bộ phim yêu thích của mình.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Tính năng chính</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Xem danh sách phim phổ biến và được đánh giá cao</li>
              <li>Tìm kiếm phim theo tên</li>
              <li>Xem thông tin chi tiết về phim, bao gồm nội dung, đánh giá, và thông tin sản xuất</li>
              <li>Giao diện người dùng hiện đại và đáp ứng trên mọi thiết bị</li>
              <li>Hỗ trợ chế độ sáng/tối</li>
              <li>Cập nhật dữ liệu phim mới nhất từ TMDB API</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Công nghệ sử dụng</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Next.js 15 - Framework React hiện đại với Server Components</li>
              <li>TypeScript - Ngôn ngữ lập trình JavaScript với kiểu dữ liệu tĩnh</li>
              <li>Tailwind CSS - Framework CSS tiện ích</li>
              <li>Shadcn UI - Thư viện giao diện người dùng</li>
              <li>TMDB API - Nguồn dữ liệu phim</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Liên hệ</h2>
            <p className="text-muted-foreground mb-6">
              Nếu bạn có bất kỳ câu hỏi, góp ý hoặc phản hồi nào, vui lòng liên hệ với chúng tôi qua email: 
              <a href="mailto:info@movie-web-app.com" className="text-primary hover:underline">info@movie-web-app.com</a>
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/">Khám phá phim ngay</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/movies">Xem tất cả phim</Link>
              </Button>
            </div>
          </section>
          
          <section className="pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              © 2024 Movie Web App. Dữ liệu phim được cung cấp bởi 
              <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                The Movie Database (TMDB)
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}