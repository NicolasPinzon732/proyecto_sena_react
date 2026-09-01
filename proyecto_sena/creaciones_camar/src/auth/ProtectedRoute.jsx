import { useNavigate } from 'react-router-dom';

const getHomeRouteByRole = (rol) => {
  const role = String(rol || '').trim().toLowerCase();
  if (role === 'admin') return '/admin';
  if (role === 'empleado') return '/empleado';
  return '/cliente/catalogo';
};

export const ProtectedRoute = ({ children, requiredRol }) => {
  const navigate = useNavigate();
  const usuarioJson = localStorage.getItem('user') || localStorage.getItem('usuario');

  if (!usuarioJson) {
    navigate('/login');
    return null;
  }

  const usuarioObj = JSON.parse(usuarioJson);
  const rolActual = String(usuarioObj.rol || '').toLowerCase();
  const rolRequerido = String(requiredRol || '').toLowerCase();

  if (requiredRol && rolActual !== rolRequerido) {
    navigate(getHomeRouteByRole(usuarioObj.rol));
    return null;
  }

  return children;
};

export const Logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('usuario');
  localStorage.removeItem('token');
  localStorage.removeItem('usuarioId');
  window.location.href = '/login';
};
