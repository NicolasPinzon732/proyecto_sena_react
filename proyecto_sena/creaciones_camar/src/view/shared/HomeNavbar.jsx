import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function HomeNavbar({ role = 'admin' }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [confirmarSalida, setConfirmarSalida] = useState(false);

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

  function confirmarCerrarSesion() {
    localStorage.removeItem('user');
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    window.location.replace('/');
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
          <button type="button" className="home-user__logout" onClick={() => setConfirmarSalida(true)}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Salir
          </button>
        </div>
      </div>

      {confirmarSalida && (
        <div className="admin-logout-overlay" role="presentation">
          <div className="admin-logout-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-logout-title">
            <div className="admin-logout-dialog__icon"><i className="bi bi-box-arrow-right"></i></div>
            <h2 id="admin-logout-title">¿Deseas cerrar sesión?</h2>
            <p>Volverás a la interfaz principal y tendrás que iniciar sesión para entrar de nuevo.</p>
            <div className="admin-logout-dialog__actions">
              <button type="button" onClick={() => setConfirmarSalida(false)}>Cancelar</button>
              <button type="button" className="confirm" onClick={confirmarCerrarSesion}>Sí, salir</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
