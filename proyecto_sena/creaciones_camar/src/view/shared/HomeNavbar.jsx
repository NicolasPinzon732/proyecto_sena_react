import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function HomeNavbar({ role = 'admin' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const links =
    role === 'admin'
      ? [
          { to: '/admin', label: 'Dashboard' },
          { to: '/admin/usuarios', label: 'Usuarios' },
          { to: '/admin/productos', label: 'Productos' },
          { to: '/admin/pedidos', label: 'Pedidos' },
        ]
      : [
          { to: '/empleado', label: 'Dashboard' },
          { to: '/empleado/pedidos', label: 'Pedidos' },
        ];

  function cerrarSesion() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <aside className="home-navbar">
      <div className="home-navbar__inner">
        <div className="home-brand">
          <img src="/logo.png" alt="Logo Creaciones Camar" className="home-brand__logo" />
          <div>
            <span className="home-brand__name">Creaciones Camar</span>
            <small>{role === 'admin' ? 'Administración' : 'Empleado'}</small>
          </div>
        </div>

        <nav className="home-nav" aria-label="Navegación principal">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`home-nav__link ${location.pathname === item.to ? 'active' : ''}`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="home-user">
          <div className="home-user__meta">
            <span>{user?.nombres || 'Usuario'}</span>
            <small>{role === 'admin' ? 'Admin' : 'Empleado'}</small>
          </div>
          <button type="button" className="home-user__logout" onClick={cerrarSesion}>
            Salir
          </button>
        </div>
      </div>
    </aside>
  );
}
