import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await authApi.thongTinTaiKhoan();
      setUser(res.content || res);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchProfile();
    else setLoading(false);
  }, [token, fetchProfile]);

  const login = async (credentials) => {
    // credentials: { taiKhoan, matKhau }
    const res = await authApi.dangNhap(credentials);
    const data = res.content || res;
    const accessToken = data.accessToken || data.token;
    if (!accessToken) throw new Error('Không nhận được token');
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // maLoaiNguoiDung === 'QuanTri' is admin
  const isAdmin = user?.maLoaiNguoiDung === 'QuanTri';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
