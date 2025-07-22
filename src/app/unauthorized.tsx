export default function UnauthorizedPage() {
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold mb-4 text-destructive">Không có quyền truy cập</h1>
      <p>Bạn không có quyền truy cập vào trang này.</p>
      <p className="mt-4">Nếu bạn nghĩ đây là nhầm lẫn, hãy liên hệ quản trị viên.</p>
    </div>
  );
} 