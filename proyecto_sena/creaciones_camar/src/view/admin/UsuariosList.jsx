import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroRol, setFiltroRol] = useState('');

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
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [filtroRol]);

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await fetch(`http://localhost:8080/api/usuarios/${id}`, { method: 'DELETE' });
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><p>Cargando...</p></div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0">Usuarios</h4>
          <p className="text-muted small mb-0">Gestiona todos los usuarios del sistema</p>
        </div>
        <a href="/admin/usuarios/crear" className="btn btn-primary">
          <i className="bi bi-plus-circle me-1"></i> Nuevo usuario
        </a>
      </div>

      <div className="card card-custom p-3 mb-4">
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

      <div className="card card-custom p-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Estado</th>
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
                  <td>
                    <span className={`badge bg-${usuario.rol === 'admin' ? 'danger' : usuario.rol === 'empleado' ? 'info' : 'secondary'}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${usuario.activo ? 'success' : 'danger'}`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <a href={`/admin/usuarios/${usuario.id}/editar`} className="btn btn-sm btn-outline-secondary me-1">
                      <i className="bi bi-pencil"></i>
                    </a>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleEliminar(usuario.id)}
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
  );
}
