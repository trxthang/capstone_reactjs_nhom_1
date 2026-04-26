// Seat map dùng data thật từ API LayDanhSachPhongVe
// danhSachGhe[i]: { maGhe, tenGhe, loaiGhe, tenLoaiGhe, giaVe, trangThai, daDat }

import { groupSeatsIntoRows } from '../../data/mockData';

const TYPE_STYLE = {
  Vip:    { base: 'bg-yellow-800 hover:bg-yellow-600 text-yellow-200',    selected: 'bg-yellow-500 text-white',     label: 'VIP' },
  Thuong: { base: 'bg-gray-700  hover:bg-blue-600   text-gray-300',       selected: 'bg-blue-500  text-white',      label: 'Thường' },
};
const BOOKED_STYLE = 'bg-gray-800 opacity-40 cursor-not-allowed text-gray-600';

export default function SeatMap({ danhSachGhe = [], selected, onToggle }) {
  const rows = groupSeatsIntoRows(danhSachGhe);

  return (
    <div className="space-y-4 overflow-x-auto">
      {/* Screen */}
      <div className="mb-8 min-w-max mx-auto">
        <div className="h-1.5 bg-linear-to-r from-transparent via-blue-400 to-transparent rounded-full" />
        <p className="text-center text-xs text-gray-500 mt-2 tracking-widest uppercase">Màn hình</p>
      </div>

      {/* Seat grid */}
      <div className="space-y-1.5 min-w-max mx-auto">
        {rows.map(({ row, seats }) => (
          <div key={row} className="flex items-center gap-1.5">
            <span className="w-5 text-center text-xs text-gray-500 font-mono shrink-0">{row}</span>
            <div className="flex gap-1">
              {seats.map((seat) => {
                const booked = seat.daDat || seat.trangThai;
                const isSelected = selected.some(s => s.maGhe === seat.maGhe);
                const typeKey = seat.loaiGhe === 'Vip' ? 'Vip' : 'Thuong';
                const style = TYPE_STYLE[typeKey] || TYPE_STYLE.Thuong;

                return (
                  <button
                    key={seat.maGhe}
                    disabled={booked}
                    onClick={() => !booked && onToggle(seat)}
                    title={`${seat.tenGhe} – ${seat.tenLoaiGhe} – ${seat.giaVe?.toLocaleString('vi-VN')}đ`}
                    className={`w-8 h-7 rounded text-xs font-medium transition-all duration-100 ${booked
                      ? BOOKED_STYLE
                      : isSelected
                        ? style.selected
                        : style.base
                      }`}
                  >
                    {seat.tenGhe}
                  </button>
                );
              })}
            </div>
            <span className="w-5 text-center text-xs text-gray-500 font-mono shrink-0">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-5 pt-6 border-t border-gray-800 min-w-max mx-auto">
        {[
          { cls: 'bg-gray-700', label: 'Thường' },
          { cls: 'bg-yellow-800', label: 'VIP' },
          { cls: 'bg-blue-500', label: 'Đang chọn' },
          { cls: 'bg-gray-800 opacity-50', label: 'Đã đặt' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-6 h-5 rounded ${item.cls}`} />
            <span className="text-xs text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
