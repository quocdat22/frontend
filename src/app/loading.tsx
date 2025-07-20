export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
        <h2 className="text-xl font-medium">Đang tải...</h2>
        <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}