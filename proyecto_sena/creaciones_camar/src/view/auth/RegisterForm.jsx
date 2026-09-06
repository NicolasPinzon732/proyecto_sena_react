import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { validarCampoRegistro, validarRegistroCompleto } from '../../utils/validacionesRegistro';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    nuip: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: validarCampoRegistro(name, value, nextFormData),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const errores = validarRegistroCompleto(formData);
    setFieldErrors(errores);

    if (Object.keys(errores).length > 0) {
      setError('Revisa los campos marcados antes de continuar.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          nuip: formData.nuip,
          email: formData.email,
          telefono: formData.telefono || '',
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la cuenta.');
      }

      setSuccess('Cuenta creada exitosamente. Redirigiendo...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center login-container">
      <div className="col-12 col-sm-8 col-md-6 col-lg-5">
        <div className="card login-card text-center">
          <h5 className="mb-4 fw-bold">Crear cuenta</h5>

          {error && (
            <div className="alert alert-danger mb-4">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4">
              <i className="bi bi-check-circle me-2"></i>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3 text-start">
              <div className="col-6">
                <label className="form-label">Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  className="form-control"
                  value={formData.nombres}
                  onChange={handleChange}
                  pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+"
                  title="Solo se permiten letras"
                  required
                />
                {fieldErrors.nombres && <small className="register-field-error">{fieldErrors.nombres}</small>}
              </div>
              <div className="col-6">
                <label className="form-label">Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  className="form-control"
                  value={formData.apellidos}
                  onChange={handleChange}
                  pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+"
                  title="Solo se permiten letras"
                  required
                />
                {fieldErrors.apellidos && <small className="register-field-error">{fieldErrors.apellidos}</small>}
              </div>
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">NUIP</label>
              <input
                type="text"
                name="nuip"
                className="form-control"
                value={formData.nuip}
                onChange={handleChange}
                maxLength="15"
                inputMode="numeric"
                placeholder="Solo números"
                required
              />
              {fieldErrors.nuip && <small className="register-field-error">{fieldErrors.nuip}</small>}
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                title="Ingresa un correo válido con @"
                required
              />
              {fieldErrors.email && <small className="register-field-error">{fieldErrors.email}</small>}
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
                pattern="[0-9]+"
                title="Solo se permiten números"
              />
              {fieldErrors.telefono && <small className="register-field-error">{fieldErrors.telefono}</small>}
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                minLength="8"
                required
              />
              {fieldErrors.password && <small className="register-field-error">{fieldErrors.password}</small>}
            </div>

            <div className="mb-4 text-start">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength="8"
                required
              />
              {fieldErrors.confirmPassword && <small className="register-field-error">{fieldErrors.confirmPassword}</small>}
            </div>

            <button type="submit" className="btn btn-main w-100 mb-3" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="text-center mt-2">
            <p className="text-muted mb-2">¿Ya tienes cuenta?</p>
            <Link to="/login" className="d-block text-muted small">Iniciar sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
