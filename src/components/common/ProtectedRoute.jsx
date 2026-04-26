import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from './Loading';

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading fullscreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <Loading fullscreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading fullscreen />;
  if (user) return <Navigate to="/" replace />;
  return children;
}
