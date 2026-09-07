import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeNavbar from '../shared/HomeNavbar';

function etiquetaRol(rol) {
  if (rol === 'admin') return 'Administrador';
  if (rol === 'empleado') return 'Empleado';
  return 'Cliente';
}

export default function UsuariosInactivos() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarUsuariosInactivos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/usuarios/inactivos');
        if (!response.ok) throw new Error('No se pudieron cargar los usuarios inactivos.');
        setUsuarios(await response.json());
      } catch (errorCarga) {
        setError(errorCarga.message || 'No se pudieron cargar los usuarios inactivos.');
      } finally {
        setCargando(false);
      }
    };

    cargarUsuariosInactivos();
  }, []);

  const activarUsuario = async (usuario) => {
    setError('');
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${usuario.id}/activar`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('No se pudo reactivar el usuario.');
      setUsuarios((usuariosActuales) => usuariosActuales.filter((item) => item.id !== usuario.id));
    } catch (errorActivacion) {
      setError(errorActivacion.message || 'No se pudo reactivar el usuario.');
    }
  };

  return (
    <>
      <HomeNavbar role="admin" />
      <div className="dashboard-shell admin-list-shell">
        <div className="dashboard-header admin-list-header">
          <div>
            <p className="dashboard-kicker">Panel administrativo</p>
            <h1>Usuarios inactivos</h1>
            <p className="text-muted small mb-0">Revisa y reactiva usuarios desactivados</p>
          </div>
          <a href="/admin/usuarios" className="admin-secondary-button">
            <i className="bi bi-arrow-left me-1"></i> Volver a usuarios
          </a>
        </div>

        {error && (
          <div className="app-validation-alert alert alert-danger mb-4" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <div className="card card-custom admin-table-card p-3">
          {cargando ? (
            <div className="admin-inactive-empty">Cargando usuarios inactivos...</div>
          ) : usuarios.length === 0 ? (
            <div className="admin-inactive-empty">
              <i className="bi bi-person-check-fill"></i>
              <strong>No hay usuarios inactivos</strong>
              <span>Todos los usuarios del sistema están activos.</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 admin-users-table">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th className="admin-users-table__role-column">Rol</th>
                    <th className="admin-users-table__status-column">Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td><strong>{usuario.nombres} {usuario.apellidos}</strong></td>
                      <td>{usuario.email}</td>
                      <td>{usuario.telefono || 'No registrado'}</td>
                      <td className="admin-users-table__role-column">
                        <span className={`user-role-badge user-role-badge--${usuario.rol || 'cliente'}`}>
                          <i className="bi bi-person-fill"></i>
                          {etiquetaRol(usuario.rol)}
                        </span>
                      </td>
                      <td className="admin-users-table__status-column">
                        <span className="user-status-badge user-status-badge--inactive">
                          <span className="user-status-badge__dot"></span> Inactivo
                        </span>
                      </td>
                      <td>
                        <button type="button" className="admin-activate-button" onClick={() => activarUsuario(usuario)}>
                          <i className="bi bi-person-check-fill me-1"></i> Activar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
