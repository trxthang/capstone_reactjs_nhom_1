import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, X, MapPin, Calendar, Clock } from 'lucide-react';
import SeatMap from '../../components/seat/SeatMap';
import orderApi from '../../api/orderApi';
import Loading from '../../components/common/Loading';
import { FALLBACK_POSTER } from '../../data/mockData';

export default function SeatSelectionPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [phongVe, setPhongVe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  const maLichChieu = state?.maLichChieu ?? null;

  // useEffect phải luôn được gọi TRƯỚC early return (Rules of Hooks)
  useEffect(() => {
    if (!maLichChieu) {
      navigate('/movies', { replace: true });
      return;
    }
    orderApi.layDanhSachPhongVe(maLichChieu)
      .then(res => setPhongVe(res?.content ?? res))
      .catch(() => navigate('/movies', { replace: true }))
      .finally(() => setLoading(false));
  }, [maLichChieu, navigate]);

  // Early return sau tất cả hooks
  if (!state?.movie) return null;

  const { movie, ngayChieu, tenRap, tenCumRap, tenHeThongRap } = state;
  const poster = movie?.hinhAnh || FALLBACK_POSTER;

  const toggleSeat = (seat) => {
    setSelected(prev => {
      const exists = prev.find(s => s.maGhe === seat.maGhe);
      if (exists) return prev.filter(s => s.maGhe !== seat.maGhe);
      if (prev.length >= 8) return prev;
      return [...prev, seat];
    });
  };

  const total = selected.reduce((sum, s) => sum + (s.giaVe || 0), 0);

  const formatDate = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return `${d.toLocaleDateString('vi-VN')} - ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleContinue = () => {
    navigate('/booking-confirm', {
      state: { movie, maLichChieu, ngayChieu, tenRap, tenCumRap, tenHeThongRap, seats: selected, total },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Booking info bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-900 rounded-2xl border border-gray-800">
        <img
          src={poster}
          alt={movie?.tenPhim}
          className="w-12 h-16 object-cover rounded-xl"
          onError={e => { e.target.src = FALLBACK_POSTER; }}
        />
        <div className="flex-1">
          <h2 className="font-bold text-white text-lg">{movie?.tenPhim}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-400">
            {tenHeThongRap && <span className="flex items-center gap-1"><MapPin size={11} />{tenHeThongRap}</span>}
            {tenCumRap && <span>{tenCumRap}</span>}
            {tenRap && <span className="flex items-center gap-1"><Clock size={11} />{tenRap}</span>}
            {ngayChieu && <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(ngayChieu)}</span>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Seat map */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-6 overflow-x-auto">
          {loading ? <Loading /> : (
            <SeatMap
              danhSachGhe={phongVe?.danhSachGhe || []}
              selected={selected}
              onToggle={toggleSeat}
            />
          )}
        </div>

        {/* Summary panel */}
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <h3 className="font-bold text-white mb-4">
              Ghế đã chọn{' '}
              <span className="text-gray-500 font-normal text-sm">({selected.length}/8)</span>
            </h3>
            {selected.length === 0 ? (
              <p className="text-gray-500 text-sm">Nhấn vào ghế để chọn</p>
            ) : (
              <div className="space-y-2">
                {selected.map(s => (
                  <div key={s.maGhe} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleSeat(s)} className="text-gray-500 hover:text-red-400 transition-colors">
                        <X size={13} />
                      </button>
                      <span className="text-white font-mono font-semibold">{s.tenGhe}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${s.loaiGhe === 'Vip' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-gray-800 text-gray-400'}`}>
                        {s.tenLoaiGhe || s.loaiGhe}
                      </span>
                    </div>
                    <span className="text-gray-300">{s.giaVe?.toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-3 mt-3 flex justify-between font-semibold">
                  <span className="text-white">Tổng cộng</span>
                  <span className="text-red-400 text-lg">{total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 text-xs text-gray-500 space-y-1.5">
            <p>• Tối đa 8 ghế mỗi lần đặt</p>
            <p>• Vé đã mua không được hoàn</p>
            <p>• Ghế chỉ giữ trong 10 phút</p>
          </div>

          <button
            disabled={selected.length === 0}
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            Xác nhận ({selected.length} ghế) <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
