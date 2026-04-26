import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    TokenCybersoft: import.meta.env.VITE_TOKEN_CYBERSOFT,
  },
});

// Thêm Bearer token vào mọi request nếu đã đăng nhập
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const data = err.response?.data;
    const status = err.response?.status;

    let msg =
      (typeof data?.content === 'string' && data.content) ||
      (typeof data?.message === 'string' && data.message) ||
      err.message ||
      'Lỗi không xác định';

    // Cybersoft trả 404 khi tài khoản không tồn tại (thay vì 401)
    if (status === 404 && msg.toLowerCase().includes('not found')) {
      msg = 'Tài khoản hoặc mật khẩu không đúng';
    }

    // Token hết hạn: xóa localStorage VÀ redirect về login
    // (chỉ dùng window.location vì axiosClient không có access vào React context)
    if (status === 401) {
      msg = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
      localStorage.removeItem('token');
      // Tránh redirect vòng lặp nếu đang ở trang login
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(msg));
  }
);

export default axiosClient;
