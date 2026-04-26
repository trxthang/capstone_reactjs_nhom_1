import { useState, useEffect } from 'react';
import { Ticket, Calendar, MapPin, Armchair, ChevronDown } from 'lucide-react';
import authApi from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';
import { FALLBACK_POSTER } from '../../data/mockData';

// danhSachVeDaDat item: { tenPhim, hinhAnh, diaChi, tenCumRap, tenRap, ghe[], thoiLuongPhim, ngayDat, giaVe, maVe, taiKhoanNguoiDat }
function TicketCard({ ve }) {
  const [open, setOpen] = useState(false);
  const date = ve.ngayDat ? new Date(ve.ngayDat).toLocaleDateString('vi-VN') : '—';
  const total = (ve.ghe || []).length * (ve.giaVe || 0);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setOpen(!open)}>
        <img
          src={ve.hinhAnh || FALLBACK_POSTER}
          alt={ve.tenPhim}
          className="w-14 h-20 object-cover rounded-xl shrink-0"
          onError={e => { e.target.src = FALLBACK_POSTER; }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white truncate">{ve.tenPhim}</p>
          <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-400">
            {ve.tenCumRap && <span className="flex items-center gap-1"><MapPin size={10} />{ve.tenCumRap}</span>}
            {ve.tenRap && <span>{ve.tenRap}</span>}
            <span className="flex items-center gap-1"><Calendar size={10} />{date}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {(ve.ghe || []).map(g => (
              <span key={g.maGhe}
                className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${g.loaiGhe === 'Vip' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-gray-800 text-gray-300'}`}>
                {g.tenGhe}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-red-400 font-bold">{total.toLocaleString('vi-VN')}đ</p>
          <ChevronDown size={16} className={`text-gray-400 mt-1 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-800 p-5 grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Địa chỉ</p>
            <p className="text-gray-300">{ve.diaChi || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Thời lượng</p>
            <p className="text-gray-300">{ve.thoiLuongPhim ? `${ve.thoiLuongPhim} phút` : '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Ghế</p>
            <p className="text-white font-mono">{(ve.ghe || []).map(g => g.tenGhe).join(', ') || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Mã vé</p>
            <p className="text-gray-300 font-mono">#{ve.maVe || '—'}</p>
          </div>
          <div className="sm:col-span-2 border-t border-gray-800 pt-3 flex justify-between font-semibold">
            <span className="text-gray-400">Tổng tiền</span>
            <span className="text-red-400 text-lg">{total.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.thongTinTaiKhoan()
      .then(res => {
        const data = res.content || res;
        setTickets(data.danhSachVeDaDat || []);
      })
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <Ticket className="text-red-500" /> Vé của tôi
      </h1>

      {loading ? <Loading /> : tickets.length === 0 ? (
        <div className="text-center py-20">
          <Ticket size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Bạn chưa đặt vé nào</p>
          <p className="text-gray-600 text-sm mt-1">Hãy chọn phim và đặt vé ngay!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">{tickets.length} vé đã đặt</p>
          {tickets.map((ve, i) => <TicketCard key={ve.maVe || i} ve={ve} />)}
        </div>
      )}
    </div>
  );
}
