import axiosClient from './axiosClient';

const orderApi = {
  // GET seat map for a showtime – returns { danhSachGhe, maLichChieu, tenRap, tenPhim, ngayChieu, giaVe, ... }
  layDanhSachPhongVe: (maLichChieu) =>
    axiosClient.get('/QuanLyDatVe/LayDanhSachPhongVe', {
      params: { MaLichChieu: maLichChieu },
    }),

  // POST book seats – body: { maLichChieu, danhSachVe: [{ maGhe, giaVe }] }
  datVe: (data) => axiosClient.post('/QuanLyDatVe/DatVe', data),

  // POST create showtime – body: { maPhim, ngayChieuGioChieu, maRap, giaVe } – admin only
  taoLichChieu: (data) => axiosClient.post('/QuanLyDatVe/TaoLichChieu', data),
};

export default orderApi;
