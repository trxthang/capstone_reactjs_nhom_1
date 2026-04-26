import { useState, useEffect } from 'react';
import { Plus, Loader } from 'lucide-react';
import movieApi from '../../api/movieApi';
import cinemaApi from '../../api/cinemaApi';
import orderApi from '../../api/orderApi';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { FALLBACK_POSTER } from '../../data/mockData';
import { toArray } from '../../api/utils';

function ShowtimeForm({ onSave, onClose }) {
  const [movies, setMovies] = useState([]);
  const [chains, setChains] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    maPhim: '',
    maRap: '',
    ngayChieuGioChieu: '',
    giaVe: 75000,
  });

  useEffect(() => {
    Promise.allSettled([movieApi.layDanhSachPhim(), cinemaApi.layThongTinHeThongRap()])
      .then(([mRes, cRes]) => {
        if (mRes.status === 'fulfilled') setMovies(toArray(mRes.value));
        if (cRes.status === 'fulfilled') setChains(toArray(cRes.value));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChainChange = async (maHeThongRap) => {
    setComplexes([]);
    setForm(f => ({ ...f, maRap: '' }));
    if (!maHeThongRap) return;
    const res = await cinemaApi.layThongTinCumRapTheoHeThong(maHeThongRap);
    setComplexes(toArray(res));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.maPhim || !form.maRap || !form.ngayChieuGioChieu) {
      toast.error('Vui lòng điền đầy đủ thông tin'); return;
    }
    setSaving(true);
    try {
      const d = new Date(form.ngayChieuGioChieu);
      const pad = n => String(n).padStart(2, '0');
      const formatted = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

      await orderApi.taoLichChieu({
        maPhim: Number(form.maPhim),
        maRap: form.maRap,
        ngayChieuGioChieu: formatted,
        giaVe: Number(form.giaVe),
      });
      toast.success('Tạo lịch chiếu thành công!');
      onSave();
    } catch (err) {
      toast.error(err.message || 'Tạo lịch chiếu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const inp = 'w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm transition-colors';

  if (loading) return <Loading />;

  const selMovie = movies.find(m => m.maPhim === Number(form.maPhim));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs text-gray-400 mb-1.5 block">Phim *</label>
        <select value={form.maPhim} onChange={e => setForm({ ...form, maPhim: e.target.value })} required className={inp}>
          <option value="">-- Chọn phim --</option>
          {movies.map(m => (
            <option key={m.maPhim} value={m.maPhim}>{m.tenPhim}</option>
          ))}
        </select>
        {selMovie && (
          <div className="flex items-center gap-3 mt-2 p-2 bg-gray-800 rounded-xl">
            <img src={selMovie.hinhAnh || FALLBACK_POSTER} alt={selMovie.tenPhim}
              className="w-10 h-14 object-cover rounded-lg"
              onError={e => { e.target.src = FALLBACK_POSTER; }} />
            <div className="text-sm">
              <p className="text-white font-medium">{selMovie.tenPhim}</p>
              {selMovie.danhGia > 0 && <p className="text-yellow-400 text-xs">⭐ {selMovie.danhGia}/10</p>}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1.5 block">Hệ thống rạp *</label>
        <select onChange={e => handleChainChange(e.target.value)} className={inp}>
          <option value="">-- Chọn hệ thống rạp --</option>
          {chains.map(c => (
            <option key={c.maHeThongRap} value={c.maHeThongRap}>{c.tenHeThongRap}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1.5 block">Cụm rạp *</label>
        <select value={form.maRap} onChange={e => setForm({ ...form, maRap: e.target.value })} required className={inp} disabled={complexes.length === 0}>
          <option value="">-- Chọn cụm rạp --</option>
          {complexes.map(c => (
            <option key={c.maCumRap} value={c.maCumRap}>{c.tenCumRap}</option>
          ))}
        </select>
        {complexes.length === 0 && <p className="text-xs text-gray-600 mt-1">Chọn hệ thống rạp trước</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1.5 block">Ngày và giờ chiếu *</label>
          <input type="datetime-local" required value={form.ngayChieuGioChieu}
            onChange={e => setForm({ ...form, ngayChieuGioChieu: e.target.value })} className={inp} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1.5 block">Giá vé (VNĐ) *</label>
          <input type="number" required min="0" step="1000" value={form.giaVe}
            onChange={e => setForm({ ...form, giaVe: e.target.value })} className={inp} />
          <p className="text-xs text-gray-600 mt-1">{Number(form.giaVe).toLocaleString('vi-VN')}đ</p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors">Hủy</button>
        <button type="submit" disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
          {saving ? <Loader size={15} className="animate-spin" /> : null} Tạo lịch chiếu
        </button>
      </div>
    </form>
  );
}

export default function ShowtimeManagePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [chains, setChains] = useState([]);
  const [selChain, setSelChain] = useState('');
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chainsLoading, setChainsLoading] = useState(true);

  useEffect(() => {
    cinemaApi.layThongTinHeThongRap()
      .then(res => {
        const list = toArray(res);
        setChains(list);
        if (list.length > 0) setSelChain(list[0].maHeThongRap);
      })
      .catch(() => {})
      .finally(() => setChainsLoading(false));
  }, []);

  useEffect(() => {
    if (!selChain) return;
    setLoading(true);
    cinemaApi.layThongTinLichChieuHeThongRap(selChain)
      .then(res => setShowtimes(toArray(res)))
      .catch(() => setShowtimes([]))
      .finally(() => setLoading(false));
  }, [selChain]);

  const flatShowtimes = showtimes.flatMap(movie =>
    (movie.lstLichChieuTheoPhim || []).flatMap(cumRap =>
      (cumRap.lstLichChieuTheoRap || []).map(lc => ({
        tenPhim: movie.tenPhim,
        hinhAnh: movie.hinhAnh,
        maPhim: movie.maPhim,
        tenCumRap: cumRap.tenCumRap,
        tenRap: lc.tenRap,
        maLichChieu: lc.maLichChieu,
        ngayChieuGioChieu: lc.ngayChieuGioChieu,
        giaVe: lc.giaVe,
      }))
    )
  );

  const formatDT = str => {
    if (!str) return '—';
    const d = new Date(str);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Quản lý lịch chiếu</h1>
          <p className="text-gray-400 text-sm mt-0.5">Tạo và xem lịch chiếu theo hệ thống rạp</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus size={16} /> Tạo lịch chiếu
        </button>
      </div>

      {!chainsLoading && chains.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {chains.map(c => (
            <button key={c.maHeThongRap} onClick={() => setSelChain(c.maHeThongRap)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${selChain === c.maHeThongRap ? 'border-red-600 bg-red-600/10 text-red-400' : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500'}`}>
              {c.logo && <img src={c.logo} alt="" className="h-4 object-contain" onError={e => { e.target.style.display = 'none'; }} />}
              {c.tenHeThongRap}
            </button>
          ))}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">Phim</th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Cụm rạp – Phòng</th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-400 uppercase">Ngày giờ chiếu</th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-400 uppercase hidden sm:table-cell">Giá vé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={4} className="py-12"><Loading /></td></tr>
            ) : flatShowtimes.length === 0 ? (
              <tr><td colSpan={4} className="py-16 text-center text-gray-500">Không có lịch chiếu</td></tr>
            ) : flatShowtimes.slice(0, 50).map((st, i) => (
              <tr key={`${st.maLichChieu}-${i}`} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={st.hinhAnh || FALLBACK_POSTER} alt={st.tenPhim}
                      className="w-8 h-12 object-cover rounded-lg shrink-0"
                      onError={e => { e.target.src = FALLBACK_POSTER; }} />
                    <p className="text-white text-sm font-medium line-clamp-2">{st.tenPhim}</p>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-gray-300 text-sm">{st.tenCumRap}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{st.tenRap}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-gray-300 text-sm font-mono">{formatDT(st.ngayChieuGioChieu)}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-red-400 text-sm font-semibold">{st.giaVe?.toLocaleString('vi-VN')}đ</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {flatShowtimes.length > 50 && (
          <p className="text-center text-gray-600 text-xs py-3">Hiển thị 50/{flatShowtimes.length} lịch chiếu</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tạo lịch chiếu mới" size="lg">
        <ShowtimeForm onSave={() => setModalOpen(false)} onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
