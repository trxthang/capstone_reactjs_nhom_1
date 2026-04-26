import { Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_POSTER } from '../../data/mockData';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  // API fields: maPhim, tenPhim, hinhAnh, danhGia, dangChieu, sapChieu
  const poster = movie.hinhAnh || FALLBACK_POSTER;

  return (
    <div
      onClick={() => navigate(`/movie/${movie.maPhim}`)}
      className="group cursor-pointer bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden aspect-2/3">
        <img
          src={poster}
          alt={movie.tenPhim}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = FALLBACK_POSTER; }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent" />

        {/* Rating badge */}
        {movie.danhGia > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-yellow-400">
            <Star size={10} fill="currentColor" />
            {movie.danhGia}
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-2 left-2">
          {movie.dangChieu && (
            <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">Đang chiếu</span>
          )}
          {movie.sapChieu && !movie.dangChieu && (
            <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">Sắp chiếu</span>
          )}
        </div>

        {/* Hover buy button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.maPhim}`); }}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
          >
            Mua vé ngay
          </button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
          {movie.tenPhim}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 text-gray-400 text-xs">
          <Clock size={11} />
          <span>120 phút</span>
          {movie.hot && (
            <span className="ml-auto px-1.5 py-0.5 bg-orange-600/30 text-orange-400 rounded text-xs font-medium">HOT</span>
          )}
        </div>
      </div>
    </div>
  );
}
