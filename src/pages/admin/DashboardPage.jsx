import { useState, useEffect } from 'react';
import { Film, Users, Building2, Clapperboard, TrendingUp, BarChart3 } from 'lucide-react';
import movieApi from '../../api/movieApi';
import userApi from '../../api/userApi';
import cinemaApi from '../../api/cinemaApi';
import { toArray } from '../../api/utils';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ movies: 0, dangChieu: 0, sapChieu: 0, users: 0, chains: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      movieApi.layDanhSachPhim(),
      userApi.layDanhSachNguoiDung(),
      cinemaApi.layThongTinHeThongRap(),
    ]).then(([m, u, c]) => {
      const movies = m.status === 'fulfilled' ? toArray(m.value) : [];
      const users  = u.status === 'fulfilled' ? toArray(u.value) : [];
      const chains = c.status === 'fulfilled' ? toArray(c.value) : [];
      setStats({
        movies: movies.length,
        dangChieu: movies.filter(x => x.dangChieu).length,
        sapChieu: movies.filter(x => x.sapChieu).length,
        users: users.length,
        chains: chains.length,
      });
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: Film,        label: 'Tổng phim',    value: loading ? '…' : stats.movies,    color: 'bg-blue-600',   sub: `${stats.dangChieu} đang chiếu · ${stats.sapChieu} sắp chiếu` },
    { icon: Users,       label: 'Người dùng',   value: loading ? '…' : stats.users,     color: 'bg-purple-600', sub: `nhóm ${import.meta.env.VITE_MA_NHOM}` },
    { icon: Building2,   label: 'Hệ thống rạp', value: loading ? '…' : stats.chains,    color: 'bg-green-600',  sub: 'toàn quốc' },
    { icon: Clapperboard,label: 'Đang chiếu',   value: loading ? '…' : stats.dangChieu, color: 'bg-red-600',    sub: `${stats.sapChieu} phim sắp chiếu` },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Tổng quan hệ thống CineMax</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <BarChart3 size={16} />
          <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Revenue chart placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={18} className="text-red-400" />
            <h2 className="font-semibold text-white">Thống kê suất chiếu theo tháng</h2>
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {[35, 55, 42, 70, 60, 85, 68, 80, 52, 90, 75, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-red-600/80 hover:bg-red-500 rounded-t transition-colors cursor-pointer" style={{ height: `${h}%` }} />
                <span className="text-xs text-gray-600">{['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Hướng dẫn nhanh</h2>
          <div className="space-y-3 text-sm text-gray-400">
            {[
              { icon: Film,      text: 'Quản lý phim: thêm/sửa/xóa phim, upload poster' },
              { icon: Building2, text: 'Xem hệ thống rạp chiếu toàn quốc' },
              { icon: Users,     text: 'Quản lý người dùng: tìm kiếm, phân quyền, xóa' },
              { icon: Clapperboard, text: 'Tạo lịch chiếu: chọn phim, rạp, ngày giờ, giá vé' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 p-3 bg-gray-800 rounded-xl">
                <Icon size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
