import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeNavbar from '../shared/HomeNavbar';

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroRol, setFiltroRol] = useState('');
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const url = filtroRol
          ? `http://localhost:8080/api/usuarios/rol/${filtroRol}`
          : 'http://localhost:8080/api/usuarios/activos';
        const response = await fetch(url);
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };

    fetchUsuarios();
  }, [filtroRol]);

  const handleEliminar = async () => {
    if (!usuarioAEliminar) return;

    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${usuarioAEliminar.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('No se pudo eliminar el usuario.');
      }
      setUsuarios(usuarios.filter(u => u.id !== usuarioAEliminar.id));
      setUsuarioAEliminar(null);
    } catch (errorEliminar) {
      console.error('Error al eliminar usuario:', errorEliminar);
      setError(errorEliminar.message || 'No se pudo eliminar el usuario.');
    }
  };

  return (
    <>
      <HomeNavbar role="admin" />
      <div className="dashboard-shell admin-list-shell">
      <div className="dashboard-header admin-list-header">
        <div>
          <p className="dashboard-kicker">Panel administrativo</p>
          <h1>Usuarios</h1>
          <p className="text-muted small mb-0">Gestiona todos los usuarios del sistema</p>
        </div>
        <div className="admin-header-actions">
          <a href="/admin/usuarios/inactivos" className="admin-secondary-button">
            <i className="bi bi-person-slash me-1"></i> Usuarios inactivos
          </a>
          <a href="/admin/usuarios/crear" className="admin-primary-button">
            <i className="bi bi-plus-circle me-1"></i> Nuevo usuario
          </a>
        </div>
      </div>

      <div className="card card-custom admin-filter-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md">
            <select
              className="form-select"
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
              <option value="empleado">Empleado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card card-custom admin-table-card p-3">
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
                  <td>
                    <strong>{usuario.nombres} {usuario.apellidos}</strong>
                  </td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefono}</td>
                  <td className="admin-users-table__role-column">
                    <span className={`user-role-badge user-role-badge--${usuario.rol || 'cliente'}`}>
                      <i className="bi bi-person-fill"></i>
                      {usuario.rol === 'admin' ? 'Administrador' : usuario.rol === 'empleado' ? 'Empleado' : 'Cliente'}
                    </span>
                  </td>
                  <td className="admin-users-table__status-column">
                    <span className={`user-status-badge user-status-badge--${usuario.activo ? 'active' : 'inactive'}`}>
                      <span className="user-status-badge__dot"></span>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <a href={`/admin/usuarios/${usuario.id}/editar`} className="btn btn-sm btn-outline-secondary me-1">
                      <i className="bi bi-pencil"></i>
                    </a>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setError('');
                        setUsuarioAEliminar(usuario);
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {usuarios.length === 0 && (
          <div className="text-center text-muted py-5">
            <i className="bi bi-people fs-2 d-block mb-2"></i>
            No hay usuarios registrados.
          </div>
        )}
      </div>
      </div>

      {usuarioAEliminar && (
        <div className="admin-delete-overlay" role="presentation">
          <div className="admin-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-user-title">
            <div className="admin-delete-dialog__icon"><i className="bi bi-trash3-fill"></i></div>
            <h2 id="delete-user-title">¿Eliminar usuario?</h2>
            <p>
              Esta acción desactivará a <strong>{usuarioAEliminar.nombres} {usuarioAEliminar.apellidos}</strong> del sistema.
            </p>
            {error && <div className="app-validation-alert alert alert-danger" role="alert">{error}</div>}
            <div className="admin-delete-dialog__actions">
              <button type="button" onClick={() => setUsuarioAEliminar(null)}>Cancelar</button>
              <button type="button" className="confirm" onClick={handleEliminar}>Eliminar usuario</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
