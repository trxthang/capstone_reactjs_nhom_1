// Fallback poster khi ảnh API lỗi
export const FALLBACK_POSTER =
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80';

// Fallback banner khi API banner lỗi
export const FALLBACK_BANNERS = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80',
  'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1400&q=80',
];

// Nhóm ghế thành các hàng (API trả về flat list, 16 ghế/hàng)
export function groupSeatsIntoRows(danhSachGhe = []) {
  const SEATS_PER_ROW = 16;
  const rows = [];
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  for (let i = 0; i < danhSachGhe.length; i += SEATS_PER_ROW) {
    const chunk = danhSachGhe.slice(i, i + SEATS_PER_ROW);
    rows.push({
      row: rowLabels[Math.floor(i / SEATS_PER_ROW)] || String(Math.floor(i / SEATS_PER_ROW) + 1),
      seats: chunk,
    });
  }
  return rows;
}
