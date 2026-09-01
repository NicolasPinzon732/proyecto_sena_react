import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';

export default function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idUsuario: '',
    tipoDocumento: { idTipo: '' },
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    rol: 'cliente',
  });
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [loading, setLoading] = useState(id ? true : false);

  useEffect(() => {
    const fetchTiposDocumento = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tipo-documentos');
        const data = await response.json();
        setTiposDocumento(data);
      } catch (error) {
        console.error('Error al cargar tipos de documento:', error);
      }
    };

    const fetchUsuario = async () => {
      if (id) {
        try {
          const response = await fetch(`http://localhost:8080/api/usuarios/${id}`);
          const data = await response.json();
          setFormData(data);
        } catch (error) {
          console.error('Error al cargar usuario:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTiposDocumento();
    fetchUsuario();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id
        ? `http://localhost:8080/api/usuarios/${id}`
        : 'http://localhost:8080/api/usuarios';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/admin/usuarios');
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><p>Cargando...</p></div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0">{id ? 'Editar' : 'Nuevo'} usuario</h4>
          <p className="text-muted small mb-0">Completa la información del usuario</p>
        </div>
        <a href="/admin/usuarios" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Volver
        </a>
      </div>

      <div className="card card-custom p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">ID de usuario</label>
              <input
                type="text"
                name="idUsuario"
                className="form-control"
                value={formData.idUsuario}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Tipo de documento</label>
              <select
                name="tipoDocumento"
                className="form-select"
                value={formData.tipoDocumento?.idTipo || ''}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona tipo de documento</option>
                {tiposDocumento.map((tipo) => (
                  <option key={tipo.idTipo} value={tipo.idTipo}>
                    {tipo.tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Nombres</label>
              <input
                type="text"
                name="nombres"
                className="form-control"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                className="form-control"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Rol</label>
              <select
                name="rol"
                className="form-select"
                value={formData.rol}
                onChange={handleChange}
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
                <option value="empleado">Empleado</option>
              </select>
            </div>

            {!id && (
              <div className="col-12 col-md-6">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <a href="/admin/usuarios" className="btn btn-outline-secondary px-4">
              Cancelar
            </a>
            <button type="submit" className="btn btn-primary px-4">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
