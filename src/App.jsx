import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { RequireAuth, RequireAdmin, GuestOnly } from './components/common/ProtectedRoute';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User pages
import HomePage from './pages/user/HomePage';
import MoviesPage from './pages/user/MoviesPage';
import MovieDetailPage from './pages/user/MovieDetailPage';
import SeatSelectionPage from './pages/user/SeatSelectionPage';
import BookingConfirmPage from './pages/user/BookingConfirmPage';
import MyTicketsPage from './pages/user/MyTicketsPage';
import ProfilePage from './pages/user/ProfilePage';
import CinemasPage from './pages/user/CinemasPage';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import MovieManagePage from './pages/admin/MovieManagePage';
import CinemaManagePage from './pages/admin/CinemaManagePage';
import UserManagePage from './pages/admin/UserManagePage';
import ShowtimeManagePage from './pages/admin/ShowtimeManagePage';

function UserPageWrapper({ children }) {
  return <UserLayout>{children}</UserLayout>;
}

function AdminPageWrapper({ children }) {
  return (
    <RequireAdmin>
      <AdminLayout>{children}</AdminLayout>
    </RequireAdmin>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

          {/* User routes */}
          <Route path="/" element={<UserPageWrapper><HomePage /></UserPageWrapper>} />
          <Route path="/movies" element={<UserPageWrapper><MoviesPage /></UserPageWrapper>} />
          <Route path="/movie/:id" element={<UserPageWrapper><MovieDetailPage /></UserPageWrapper>} />
          <Route path="/cinemas" element={<UserPageWrapper><CinemasPage /></UserPageWrapper>} />
          <Route path="/seat-selection" element={
            <RequireAuth>
              <UserPageWrapper><SeatSelectionPage /></UserPageWrapper>
            </RequireAuth>
          } />
          <Route path="/booking-confirm" element={
            <RequireAuth>
              <UserPageWrapper><BookingConfirmPage /></UserPageWrapper>
            </RequireAuth>
          } />
          <Route path="/my-tickets" element={
            <RequireAuth>
              <UserPageWrapper><MyTicketsPage /></UserPageWrapper>
            </RequireAuth>
          } />
          <Route path="/profile" element={
            <RequireAuth>
              <UserPageWrapper><ProfilePage /></UserPageWrapper>
            </RequireAuth>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminPageWrapper><DashboardPage /></AdminPageWrapper>} />
          <Route path="/admin/movies" element={<AdminPageWrapper><MovieManagePage /></AdminPageWrapper>} />
          <Route path="/admin/cinemas" element={<AdminPageWrapper><CinemaManagePage /></AdminPageWrapper>} />
          <Route path="/admin/users" element={<AdminPageWrapper><UserManagePage /></AdminPageWrapper>} />
          <Route path="/admin/showtimes" element={<AdminPageWrapper><ShowtimeManagePage /></AdminPageWrapper>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
