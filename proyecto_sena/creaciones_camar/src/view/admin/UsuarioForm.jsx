import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import HomeNavbar from '../shared/HomeNavbar';
import { validarRegistroCompleto } from '../../utils/validacionesRegistro';

export default function UsuarioForm({ self = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuarioSesion = JSON.parse(localStorage.getItem('user') || localStorage.getItem('usuario') || '{}');
  const usuarioId = self ? usuarioSesion.id : id;
  const rolSesion = String(usuarioSesion.rol || 'cliente').toLowerCase();
  const [formData, setFormData] = useState({
    idUsuario: '',
    tipoDocumento: { idTipo: '' },
    nombres: '',
    apellidos: '',
    nuip: '',
    email: '',
    telefono: '',
    password: '',
    rol: 'cliente',
  });
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(usuarioId ? true : false);

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
      if (usuarioId) {
        try {
          const response = await fetch(`http://localhost:8080/api/usuarios/${usuarioId}`);
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
  }, [usuarioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tipoDocumento'
        ? { ...(prev.tipoDocumento || {}), idTipo: value ? Number(value) : '' }
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errores = validarRegistroCompleto({
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      nuip: formData.nuip,
      email: formData.email,
      telefono: formData.telefono,
      password: usuarioId ? (formData.password || 'Password123') : formData.password,
      confirmPassword: usuarioId ? (formData.password || 'Password123') : formData.password,
    });

    if (!formData.nuip) {
      errores.nuip = 'El NUIP es obligatorio.';
    }

    if (!formData.email || !formData.email.includes('@')) {
      errores.email = 'Ingresa un correo válido con formato usuario@dominio.com.';
    }
    if (!formData.tipoDocumento?.idTipo) {
      errores.tipoDocumento = 'Selecciona un tipo de documento.';
    }

    setErrors(errores);
    if (Object.keys(errores).length > 0) {
      setError(Object.values(errores)[0]);
      return;
    }

    try {
      const method = usuarioId ? 'PUT' : 'POST';
      const url = usuarioId
        ? `http://localhost:8080/api/usuarios/${usuarioId}`
        : 'http://localhost:8080/api/usuarios';

      const datosUsuario = Object.fromEntries(
        Object.entries(formData).filter(([campo]) => (
          (!usuarioId || formData.password || campo !== 'password')
          && (!self || campo !== 'rol')
        ))
      );
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosUsuario),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo guardar el usuario.');
      }
      navigate(self ? (rolSesion === 'admin' ? '/admin' : '/empleado') : '/admin/usuarios');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setError(error.message || 'No se pudo guardar el usuario.');
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><p>Cargando...</p></div>;
  }

  return (
    <>
      <HomeNavbar role={rolSesion === 'empleado' ? 'empleado' : 'admin'} />
      <div className="dashboard-shell admin-form-shell">
      <div className="dashboard-header admin-list-header admin-form-header">
        <div>
          <p className="dashboard-kicker">{rolSesion === 'empleado' ? 'Panel operativo · Empleado' : 'Panel administrativo · Usuarios'}</p>
          <h1>{self ? 'Mi perfil' : usuarioId ? 'Editar usuario' : 'Nuevo usuario'}</h1>
          <p className="text-muted small mb-0">Completa la información del usuario</p>
        </div>
        {(!self || rolSesion === 'admin') && (
          <a href={self ? '/admin' : '/admin/usuarios'} className="admin-secondary-button">
            <i className="bi bi-arrow-left me-1"></i> Volver
          </a>
        )}
      </div>

      <div className="card card-custom admin-form-card">
        <div className="admin-form-card__intro">
          <div className="admin-form-card__icon"><i className="bi bi-person-vcard-fill"></i></div>
          <div>
            <h2>Datos de la cuenta</h2>
            <p>Revisa y actualiza la información del usuario.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="app-validation-alert alert alert-danger mb-4" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          <div className="row g-3">
            {!usuarioId && (
              <div className="col-12 col-md-6">
                <label className="form-label">NUIP</label>
                <input
                  type="text"
                  name="nuip"
                  className="form-control"
                  value={formData.nuip}
                  onChange={handleChange}
                  maxLength="15"
                  inputMode="numeric"
                />
                {errors.nuip && <small className="register-field-error">{errors.nuip}</small>}
              </div>
            )}

            <div className="col-12 col-md-6">
              <label className="form-label">Tipo de documento</label>
              <select
                name="tipoDocumento"
                className="form-select"
                value={formData.tipoDocumento?.idTipo || ''}
                onChange={handleChange}
              >
                <option value="">Selecciona tipo de documento</option>
                {tiposDocumento.map((tipo) => (
                  <option key={tipo.idTipo} value={tipo.idTipo}>
                    {tipo.tipo}
                  </option>
                ))}
              </select>
              {errors.tipoDocumento && <small className="register-field-error">{errors.tipoDocumento}</small>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Nombres</label>
              <input
                type="text"
                name="nombres"
                className="form-control"
                value={formData.nombres}
                onChange={handleChange}
              />
              {errors.nombres && <small className="register-field-error">{errors.nombres}</small>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                className="form-control"
                value={formData.apellidos}
                onChange={handleChange}
              />
              {errors.apellidos && <small className="register-field-error">{errors.apellidos}</small>}
            </div>

            {id && (
              <div className="col-12 col-md-6">
                <label className="form-label">NUIP</label>
                <input
                  type="text"
                  name="nuip"
                  className="form-control"
                  value={formData.nuip}
                  onChange={handleChange}
                  maxLength="15"
                  inputMode="numeric"
                />
                {errors.nuip && <small className="register-field-error">{errors.nuip}</small>}
              </div>
            )}

            <div className="col-12 col-md-6">
              <label className="form-label">Email</label>
              <input
                type="text"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <small className="register-field-error">{errors.email}</small>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
              />
              {errors.telefono && <small className="register-field-error">{errors.telefono}</small>}
            </div>

            {!self && (
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
            )}

            {(!usuarioId || self) && (
              <div className="col-12 col-md-6">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />
                  {errors.password && <small className="register-field-error">{errors.password}</small>}
              </div>
            )}
          </div>

          <div className="admin-form-actions">
            <a href={self ? (rolSesion === 'admin' ? '/admin' : '/empleado') : '/admin/usuarios'} className="admin-secondary-button">
              Cancelar
            </a>
            <button type="submit" className="admin-primary-button">
              Guardar
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
}
