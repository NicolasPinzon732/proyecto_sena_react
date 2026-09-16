import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

const getHomeRouteByRole = (rol) => {
  const role = String(rol || '').trim().toLowerCase();

  if (role === 'admin') return '/admin';
  if (role === 'empleado') return '/empleado';
  return '/cliente/catalogo';
};

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      const message = 'El correo y la contraseña son obligatorios.';
      setError(message);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Correo o contraseña incorrectos.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Correo o contraseña incorrectos.');
      }

      const usuario = { ...data.user, token: data.token };
      localStorage.setItem('user', JSON.stringify(usuario));
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('token', data.token);

      navigate(getHomeRouteByRole(data.user?.rol));
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center login-container">
      <div className="col-12 col-sm-8 col-md-6 col-lg-4">
        <div className="card login-card text-center">
          <h5 className="mb-4 fw-bold">Inicia sesión en Creaciones Camar</h5>

          {error && (
            <div className="app-validation-alert alert alert-danger mb-4">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Correo</label>
              <input
                type="text"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>

            <div className="mb-4 text-start">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
              />
            </div>

            <button type="submit" className="btn btn-main w-100 mb-3" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-2 text-center">
            <Link to="/register" className="d-block text-muted small">Crear cuenta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
