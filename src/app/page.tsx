import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      {/* Featured Movie Banner */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-background">
        <div className="container mx-auto px-4">          
          <div className="relative overflow-hidden rounded-xl shadow-xl max-w-6xl mx-auto">
            {/* Movie Banner Image */}
            <div className="aspect-[21/9] bg-muted relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center bg-card/20">
                <span className="text-muted-foreground text-xl">Ảnh banner phim nổi bật</span>
              </div>
            </div>
            
            {/* Movie Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                {/* Movie Poster */}
                <div className="w-32 h-48 bg-card rounded-lg shadow-lg hidden md:block relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Poster</span>
                  </div>
                </div>
                
                {/* Movie Details */}
                <div className="flex-1">
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">Tên phim nổi bật</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-primary/20 text-primary-foreground rounded text-xs">Hành động</span>
                    <span className="px-2 py-1 bg-primary/20 text-primary-foreground rounded text-xs">Phiêu lưu</span>
                    <span className="px-2 py-1 bg-primary/20 text-primary-foreground rounded text-xs">2023</span>
                  </div>
                  <p className="text-white/80 mb-4 max-w-2xl">Mô tả ngắn về bộ phim nổi bật này. Đây là một bộ phim hấp dẫn với nhiều tình tiết gay cấn và diễn xuất tuyệt vời từ dàn diễn viên chính.</p>
                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" className="rounded-full px-6">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                      Xem ngay
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full px-6 bg-white/10 hover:bg-white/20 border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                      </svg>
                      Thêm vào danh sách
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Movies List Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Danh sách phim</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/movies">Xem tất cả</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Movie Cards */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
                <div className="aspect-[2/3] bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground">Ảnh phim {item}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                      Xem
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate">Tên phim {item}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">2023</p>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500 mr-1">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
