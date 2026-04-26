import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import movieApi from '../../api/movieApi';
import MovieCard from '../../components/movie/MovieCard';
import Loading from '../../components/common/Loading';
import { FALLBACK_BANNERS, FALLBACK_POSTER } from '../../data/mockData';
import { toArray } from '../../api/utils';

function HeroBanner({ banners }) {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  // banners: [{ maBanner, maPhim, hinhAnh }]
  const items = banners.slice(0, 5);
  if (!items.length) return null;
  const cur = items[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="relative h-[70vh] min-h-96 overflow-hidden">
      <img
        src={cur.hinhAnh || FALLBACK_BANNERS[idx % FALLBACK_BANNERS.length]}
        alt="Banner"
        className="w-full h-full object-cover transition-all duration-700"
        onError={(e) => { e.target.src = FALLBACK_BANNERS[0]; }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-gray-950/80 via-gray-950/40 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-transparent to-transparent" />

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => cur.maPhim && navigate(`/movie/${cur.maPhim}`)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
              >
                Mua vé ngay
              </button>
              <button
                onClick={() => navigate('/movies')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-colors"
              >
                Xem tất cả phim
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIdx(i => (i - 1 + items.length) % items.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setIdx(i => (i + 1) % items.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`transition-all duration-300 rounded-full ${i === idx ? 'w-6 h-2 bg-red-500' : 'w-2 h-2 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [dangChieu, setDangChieu] = useState([]);
  const [sapChieu, setSapChieu] = useState([]);
  const [tab, setTab] = useState('dangChieu');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // allSettled: banner lỗi không kéo movie theo
    Promise.allSettled([
      movieApi.layDanhSachBanner(),
      movieApi.layDanhSachPhim(),
    ]).then(([bRes, mRes]) => {
      if (bRes.status === 'fulfilled') setBanners(toArray(bRes.value));
      if (mRes.status === 'fulfilled') {
        const movies = toArray(mRes.value);
        setDangChieu(movies.filter(m => m.dangChieu));
        setSapChieu(movies.filter(m => m.sapChieu));
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullscreen />;

  const displayed = tab === 'dangChieu' ? dangChieu : sapChieu;

  return (
    <div>
      <HeroBanner banners={banners} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tab selector */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setTab('dangChieu')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${tab === 'dangChieu' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            <TrendingUp size={16} /> Đang chiếu
            <span className="ml-1 text-xs opacity-70">({dangChieu.length})</span>
          </button>
          <button
            onClick={() => setTab('sapChieu')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${tab === 'sapChieu' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            <Calendar size={16} /> Sắp chiếu
            <span className="ml-1 text-xs opacity-70">({sapChieu.length})</span>
          </button>
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Không có phim nào</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayed.map(m => <MovieCard key={m.maPhim} movie={m} />)}
          </div>
        )}
      </div>
    </div>
  );
}
