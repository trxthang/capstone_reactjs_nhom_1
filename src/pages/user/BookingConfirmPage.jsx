import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Calendar, Armchair, Loader } from 'lucide-react';
import orderApi from '../../api/orderApi';
import { useAuth } from '../../contexts/AuthContext';
import { FALLBACK_POSTER } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function BookingConfirmPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!state?.movie) { navigate('/movies'); return null; }
  const { movie, maLichChieu, ngayChieu, tenRap, tenCumRap, tenHeThongRap, seats, total } = state;
  const poster = movie.hinhAnh || FALLBACK_POSTER;

  const formatDate = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return `${d.toLocaleDateString('vi-VN')} - ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await orderApi.datVe({
        maLichChieu,
        danhSachVe: seats.map(s => ({ maGhe: s.maGhe, giaVe: s.giaVe })),
      });
      setDone(true);
      toast.success('Đặt vé thành công!');
    } catch (err) {
      toast.error(err.message || 'Đặt vé thất bại, thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 rounded-3xl border border-gray-800 p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Đặt vé thành công!</h2>
          <p className="text-gray-400 mb-1 text-lg font-medium">{movie.tenPhim}</p>
          <div className="text-sm text-gray-500 mb-2 space-y-1">
            {tenHeThongRap && <p>{tenHeThongRap} – {tenCumRap}</p>}
            <p>{formatDate(ngayChieu)} • {tenRap}</p>
          </div>
          <p className="font-mono font-bold text-white text-base mb-1">
            {seats.map(s => s.tenGhe).join(', ')}
          </p>
          <p className="text-red-400 font-semibold text-xl mb-6">{total.toLocaleString('vi-VN')}đ</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/my-tickets')}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors">
              Xem vé của tôi
            </button>
            <button onClick={() => navigate('/')}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors">
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Xác nhận đặt vé</h1>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-6">
        {/* Movie info */}
        <div className="flex gap-5 p-6 border-b border-gray-800">
          <img src={poster} alt={movie.tenPhim}
            className="w-20 h-28 object-cover rounded-xl shrink-0"
            onError={e => { e.target.src = FALLBACK_POSTER; }} />
          <div>
            <h2 className="font-bold text-white text-xl mb-3">{movie.tenPhim}</h2>
            <div className="space-y-2 text-sm text-gray-400">
              {(tenHeThongRap || tenCumRap) && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-red-400 shrink-0" />
                  <span>{[tenHeThongRap, tenCumRap].filter(Boolean).join(' – ')}</span>
                </div>
              )}
              {tenRap && <div className="flex items-center gap-2"><MapPin size={14} className="text-red-400 shrink-0" />{tenRap}</div>}
              {ngayChieu && (
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-red-400 shrink-0" />
                  {formatDate(ngayChieu)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seats */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
            <Armchair size={14} className="text-red-400" />
            Ghế đã chọn
          </div>
          <div className="flex flex-wrap gap-2">
            {seats.map(s => (
              <span key={s.maGhe}
                className={`px-3 py-1.5 rounded-lg text-sm font-mono font-semibold border ${s.loaiGhe === 'Vip'
                  ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700'
                  : 'bg-gray-800 text-white border-gray-700'
                  }`}>
                {s.tenGhe}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="p-6">
          <div className="space-y-2 mb-4">
            {Object.entries(
              seats.reduce((acc, s) => {
                const k = s.loaiGhe || 'Thuong';
                if (!acc[k]) acc[k] = { count: 0, price: s.giaVe, label: s.tenLoaiGhe || k };
                acc[k].count++;
                return acc;
              }, {})
            ).map(([k, { count, price, label }]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-gray-400">{label} × {count}</span>
                <span className="text-gray-300">{(price * count).toLocaleString('vi-VN')}đ</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold border-t border-gray-700 pt-4">
            <span className="text-white text-lg">Tổng cộng</span>
            <span className="text-red-400 text-2xl">{total.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 mb-6">
        <p className="text-sm text-gray-400 font-medium mb-3">Thông tin người đặt</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-gray-500">Tài khoản</p><p className="text-white font-medium mt-0.5">{user?.taiKhoan}</p></div>
          <div><p className="text-gray-500">Họ tên</p><p className="text-white font-medium mt-0.5">{user?.hoTen}</p></div>
          <div><p className="text-gray-500">Email</p><p className="text-white font-medium mt-0.5">{user?.email}</p></div>
          <div><p className="text-gray-500">SĐT</p><p className="text-white font-medium mt-0.5">{user?.soDt || '—'}</p></div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => navigate(-1)}
          className="flex-1 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors">
          Quay lại
        </button>
        <button onClick={handleConfirm} disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
          {loading
            ? <><Loader size={18} className="animate-spin" />Đang xử lý...</>
            : `Xác nhận — ${total.toLocaleString('vi-VN')}đ`}
        </button>
      </div>
    </div>
  );
}
