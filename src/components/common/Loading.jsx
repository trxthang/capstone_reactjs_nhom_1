export default function Loading({ fullscreen = false }) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
