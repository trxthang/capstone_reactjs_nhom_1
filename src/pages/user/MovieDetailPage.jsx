import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, ChevronRight, Play, MapPin } from 'lucide-react';
import movieApi from '../../api/movieApi';
import cinemaApi from '../../api/cinemaApi';
import { FALLBACK_POSTER } from '../../data/mockData';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// lịch chiếu shape:
// [{ maHeThongRap, tenHeThongRap, logo, cumRapChieu: [{ maCumRap, tenCumRap, diaChi, lichChieuPhim: [{ maLichChieu, ngayChieuGioChieu, tenRap, giaVe }] }] }]

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [lichChieu, setLichChieu] = useState([]);  // per-chain showtime data
  const [loading, setLoading] = useState(true);

  // selection state
  const [selChain, setSelChain] = useState(null);    // maHeThongRap
  const [selComplex, setSelComplex] = useState(null); // maCumRap
  const [selShowtime, setSelShowtime] = useState(null); // { maLichChieu, ngayChieuGioChieu, tenRap, giaVe }

  useEffect(() => {
    Promise.all([
      movieApi.layThongTinPhim(Number(id)),
      cinemaApi.layThongTinLichChieuPhim(Number(id)),
    ])
      .then(([mRes, cRes]) => {
        // Cybersoft bọc data trong { content }, nhưng đôi khi trả trực tiếp
        const movieData = mRes?.content ?? mRes;
        setMovie(movieData);

        // Đảm bảo chains luôn là mảng dù API trả null/object/array
        const raw = cRes?.content ?? cRes;
        const chains = Array.isArray(raw) ? raw : [];
        setLichChieu(chains);

        if (chains.length > 0) {
          setSelChain(chains[0].maHeThongRap);
          const firstComplex = chains[0].cumRapChieu?.[0];
          if (firstComplex) setSelComplex(firstComplex.maCumRap);
        }
      })
      .catch(() => navigate('/movies'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Guard: lichChieu luôn là mảng sau fix trên, nhưng phòng render trước setState
  const chains = Array.isArray(lichChieu) ? lichChieu : [];
  const activeChain = chains.find(c => c.maHeThongRap === selChain);
  const activeComplex = activeChain?.cumRapChieu?.find(c => c.maCumRap === selComplex);
  const showtimes = activeComplex?.lichChieuPhim || [];

  const handleBooking = () => {
    if (!user) { toast.error('Vui lòng đăng nhập để đặt vé'); navigate('/login'); return; }
    if (!selShowtime) { toast.error('Vui lòng chọn suất chiếu'); return; }
    navigate('/seat-selection', {
      state: {
        movie,
        maLichChieu: selShowtime.maLichChieu,
        ngayChieu: selShowtime.ngayChieuGioChieu,
        tenRap: selShowtime.tenRap,
        tenCumRap: activeComplex?.tenCumRap,
        tenHeThongRap: activeChain?.tenHeThongRap,
        giaVe: selShowtime.giaVe,
      },
    });
  };

  if (loading) return <Loading fullscreen />;
  if (!movie) return null;

  const poster = movie.hinhAnh || FALLBACK_POSTER;

  return (
    <div>
      {/* Blurred hero */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={poster}
          alt={movie.tenPhim}
          className="w-full h-full object-cover blur-sm scale-105 opacity-30"
          onError={e => { e.target.src = FALLBACK_POSTER; }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/70 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-52 relative pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0">
            <div className="w-44 md:w-52 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-gray-800">
              <img
                src={poster}
                alt={movie.tenPhim}
                className="w-full aspect-2/3 object-cover"
                onError={e => { e.target.src = FALLBACK_POSTER; }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-16">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {movie.dangChieu && <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">Đang chiếu</span>}
              {movie.sapChieu && <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">Sắp chiếu</span>}
              {movie.hot && <span className="px-2 py-0.5 bg-orange-600 text-white text-xs font-semibold rounded">HOT</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{movie.tenPhim}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-5">
              {movie.danhGia > 0 && (
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <Star size={15} fill="currentColor" />
                  <span className="font-semibold">{movie.danhGia}/10</span>
                </div>
              )}
              <div className="flex items-center gap-1.5"><Clock size={14} /><span>120 phút</span></div>
              {movie.ngayKhoiChieu && (
                <span>Khởi chiếu: {new Date(movie.ngayKhoiChieu).toLocaleDateString('vi-VN')}</span>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed mb-5 max-w-2xl">
              {movie.moTa || 'Không có mô tả cho bộ phim này.'}
            </p>

            {movie.trailer && (
              <a
                href={movie.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors text-sm"
              >
                <Play size={14} fill="white" /> Xem trailer
              </a>
            )}
          </div>
        </div>

        {/* Booking Panel */}
        <div className="mt-12 bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Chọn suất chiếu</h2>

          {chains.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>Chưa có lịch chiếu cho phim này</p>
            </div>
          ) : (
            <>
              {/* Cinema chain tabs */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Hệ thống rạp</p>
                <div className="flex flex-wrap gap-3">
                  {chains.map(chain => (
                    <button
                      key={chain.maHeThongRap}
                      onClick={() => {
                        setSelChain(chain.maHeThongRap);
                        setSelComplex(chain.cumRapChieu?.[0]?.maCumRap || null);
                        setSelShowtime(null);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${selChain === chain.maHeThongRap
                        ? 'border-red-600 bg-red-600/10'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                        }`}
                    >
                      {chain.logo && (
                        <img src={chain.logo} alt={chain.tenHeThongRap} className="h-5 object-contain" onError={e => { e.target.style.display = 'none'; }} />
                      )}
                      <span className={`text-sm font-medium ${selChain === chain.maHeThongRap ? 'text-red-400' : 'text-gray-300'}`}>
                        {chain.tenHeThongRap}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cinema complex select */}
              {activeChain?.cumRapChieu?.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Cụm rạp</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeChain.cumRapChieu.map(complex => (
                      <button
                        key={complex.maCumRap}
                        onClick={() => { setSelComplex(complex.maCumRap); setSelShowtime(null); }}
                        className={`text-left px-4 py-3 rounded-xl border transition-colors ${selComplex === complex.maCumRap
                          ? 'border-red-600 bg-red-600/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          }`}
                      >
                        <p className={`font-medium text-sm ${selComplex === complex.maCumRap ? 'text-red-400' : 'text-white'}`}>
                          {complex.tenCumRap}
                        </p>
                        {complex.diaChi && (
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin size={10} />{complex.diaChi}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {complex.lichChieuPhim?.length || 0} suất chiếu
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Showtime slots */}
              {showtimes.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Suất chiếu</p>
                  <div className="flex flex-wrap gap-2">
                    {showtimes.map(st => {
                      const d = new Date(st.ngayChieuGioChieu);
                      const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                      const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                      const isSelected = selShowtime?.maLichChieu === st.maLichChieu;
                      return (
                        <button
                          key={st.maLichChieu}
                          onClick={() => setSelShowtime(st)}
                          className={`px-4 py-2.5 rounded-xl border text-sm transition-colors ${isSelected
                            ? 'border-red-600 bg-red-600/10 text-red-400'
                            : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500'
                            }`}
                        >
                          <p className="font-mono font-bold">{timeStr}</p>
                          <p className="text-xs opacity-70 mt-0.5">{dateStr} • {st.tenRap}</p>
                          <p className="text-xs text-red-400/70 mt-0.5">{st.giaVe?.toLocaleString('vi-VN')}đ</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeComplex && showtimes.length === 0 && (
                <p className="text-gray-500 text-sm mb-6">Không có suất chiếu cho cụm rạp này</p>
              )}

              <button
                onClick={handleBooking}
                disabled={!selShowtime}
                className="flex items-center justify-center gap-2 w-full md:w-auto md:px-12 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
              >
                Tiếp theo — Chọn ghế <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
