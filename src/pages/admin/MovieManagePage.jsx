import { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, Loader, ImagePlus, Star } from 'lucide-react';
import movieApi from '../../api/movieApi';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { FALLBACK_POSTER } from '../../data/mockData';
import { toArray } from '../../api/utils';

const MA_NHOM = import.meta.env.VITE_MA_NHOM;

function MovieForm({ initial, onSave, onClose }) {
  const fileRef = useRef();
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(initial?.hinhAnh || '');
  const [form, setForm] = useState({
    tenPhim: initial?.tenPhim || '',
    trailer: initial?.trailer || '',
    moTa: initial?.moTa || '',
    ngayKhoiChieu: initial?.ngayKhoiChieu
      ? new Date(initial.ngayKhoiChieu).toISOString().split('T')[0]
      : '',
    dangChieu: initial?.dangChieu ?? false,
    sapChieu: initial?.sapChieu ?? true,
    hot: initial?.hot ?? false,
    danhGia: initial?.danhGia ?? 0,
  });

  const set = f => e => setForm({ ...form, [f]: e.target.value });
  const toggle = f => setForm(prev => ({ ...prev, [f]: !prev[f] }));

  const inp = 'w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm transition-colors';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('tenPhim', form.tenPhim);
      fd.append('trailer', form.trailer);
      fd.append('moTa', form.moTa);
      fd.append('maNhom', MA_NHOM);
      fd.append('ngayKhoiChieu', form.ngayKhoiChieu);
      fd.append('dangChieu', form.dangChieu);
      fd.append('sapChieu', form.sapChieu);
      fd.append('hot', form.hot);
      fd.append('danhGia', form.danhGia);
      if (initial?.maPhim) fd.append('maPhim', initial.maPhim);
      if (fileRef.current?.files?.[0]) fd.append('File', fileRef.current.files[0]);

      if (initial?.maPhim) await movieApi.capNhatPhim(fd);
      else await movieApi.themPhim(fd);

      toast.success(initial?.maPhim ? 'Cập nhật phim thành công' : 'Thêm phim thành công');
      onSave();
    } catch (err) {
      toast.error(err.message || 'Thao tác thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1.5 block">Tên phim *</label>
          <input required value={form.tenPhim} onChange={set('tenPhim')} placeholder="Tên phim" className={inp} />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Ngày khởi chiếu</label>
          <input type="date" value={form.ngayKhoiChieu} onChange={set('ngayKhoiChieu')} className={inp} />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Đánh giá (0–10)</label>
          <input type="number" min="0" max="10" step="0.1" value={form.danhGia} onChange={set('danhGia')} className={inp} />
        </div>

        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1.5 block">Trailer URL</label>
          <input value={form.trailer} onChange={set('trailer')} placeholder="https://youtube.com/..." className={inp} />
        </div>

        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1.5 block">Mô tả</label>
          <textarea value={form.moTa} onChange={set('moTa')} rows={3} placeholder="Nội dung phim..." className={`${inp} resize-none`} />
        </div>

        {/* Checkboxes */}
        <div className="col-span-2 flex flex-wrap gap-4">
          {[
            { key: 'dangChieu', label: 'Đang chiếu' },
            { key: 'sapChieu',  label: 'Sắp chiếu' },
            { key: 'hot',       label: 'HOT' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => toggle(key)}
                className={`w-10 h-5 rounded-full transition-colors ${form[key] ? 'bg-red-600' : 'bg-gray-700'} relative`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-gray-300">{label}</span>
            </label>
          ))}
        </div>

        {/* Image upload */}
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1.5 block">Poster phim</label>
          <div className="flex items-start gap-4">
            <div className="w-20 h-28 rounded-xl overflow-hidden bg-gray-800 shrink-0">
              <img
                src={preview || FALLBACK_POSTER}
                alt="preview"
                className="w-full h-full object-cover"
                onError={e => { e.target.src = FALLBACK_POSTER; }}
              />
            </div>
            <div className="flex-1">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                id="file-upload"
                onChange={e => {
                  const f = e.target.files[0];
                  if (f) setPreview(URL.createObjectURL(f));
                }}
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-xl text-sm cursor-pointer transition-colors"
              >
                <ImagePlus size={16} /> Chọn ảnh
              </label>
              <p className="text-xs text-gray-600 mt-2">JPG, PNG – để trống giữ ảnh cũ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors">Hủy</button>
        <button type="submit" disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
          {saving ? <Loader size={15} className="animate-spin" /> : null}
          {initial?.maPhim ? 'Cập nhật' : 'Thêm phim'}
        </button>
      </div>
    </form>
  );
}

export default function MovieManagePage() {
  const [allMovies, setAllMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const PAGE_SIZE = 10;

  const load = () => {
    setLoading(true);
    movieApi.layDanhSachPhim()
      .then(res => setAllMovies(toArray(res)))
      .catch(() => setAllMovies([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    if (!search) return allMovies;
    const q = search.toLowerCase();
    return allMovies.filter(m => m.tenPhim?.toLowerCase().includes(q));
  }, [allMovies, search]);

  const movies = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const total = filtered.length;

  const handleDelete = async (maPhim) => {
    if (!confirm('Xóa phim này?')) return;
    try { await movieApi.xoaPhim(maPhim); toast.success('Đã xóa phim'); load(); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Quản lý phim</h1>
          <p className="text-gray-400 text-sm mt-0.5">{total} phim trong hệ thống</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm phim..."
              className="bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 w-52" />
          </div>
          <button onClick={() => { setEditing(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors">
            <Plus size={16} /> Thêm phim
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">Phim</th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-400 uppercase hidden lg:table-cell">Trạng thái</th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Đánh giá</th>
              <th className="text-right px-5 py-4 text-xs font-medium text-gray-400 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={4} className="py-12"><Loading /></td></tr>
            ) : movies.length === 0 ? (
              <tr><td colSpan={4} className="py-16 text-center text-gray-500">Không có phim nào</td></tr>
            ) : movies.map(m => (
              <tr key={m.maPhim} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={m.hinhAnh || FALLBACK_POSTER} alt={m.tenPhim}
                      className="w-10 h-14 object-cover rounded-lg shrink-0"
                      onError={e => { e.target.src = FALLBACK_POSTER; }} />
                    <div>
                      <p className="text-white font-medium text-sm line-clamp-2">{m.tenPhim}</p>
                      <p className="text-gray-500 text-xs mt-0.5">ID: {m.maPhim}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <div className="flex flex-col gap-1">
                    {m.dangChieu && <span className="text-xs px-2 py-0.5 bg-red-900/40 text-red-400 rounded-full w-fit">Đang chiếu</span>}
                    {m.sapChieu  && <span className="text-xs px-2 py-0.5 bg-blue-900/40 text-blue-400 rounded-full w-fit">Sắp chiếu</span>}
                    {m.hot       && <span className="text-xs px-2 py-0.5 bg-orange-900/40 text-orange-400 rounded-full w-fit">HOT</span>}
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  {m.danhGia > 0 && (
                    <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                      <Star size={13} fill="currentColor" />{m.danhGia}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditing(m); setModalOpen(true); }}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(m.maPhim)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} onChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Chỉnh sửa phim' : 'Thêm phim mới'} size="lg">
        <MovieForm initial={editing} onSave={() => { setModalOpen(false); load(); }} onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
