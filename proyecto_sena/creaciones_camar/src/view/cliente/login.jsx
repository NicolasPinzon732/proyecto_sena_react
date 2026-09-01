import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(e) {
    e.preventDefault();
    setError("");

    if (!correo || !contrasena) {
      setError("Correo y contraseña son obligatorios.");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ correo, contraseña: contrasena }),
      });

      // Guarda el usuario y el token juntos, para que apiFetch()
      // los encuentre automáticamente en las siguientes peticiones.
      localStorage.setItem(
        "user",
        JSON.stringify({ ...respuesta.user, token: respuesta.token })
      );

      const rol = String(respuesta.user?.rol || '').trim().toLowerCase();
      if (rol === 'admin') {
        navigate('/admin');
      } else if (rol === 'empleado') {
        navigate('/empleado');
      } else {
        navigate('/cliente/catalogo');
      }
    } catch (err) {
      setError(err.message || "Correo o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center login-container">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card login-card text-center">
          <h5 className="mb-4">Inicia sesión en Creaciones Camar</h5>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={manejarSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-main w-100 mb-3" disabled={cargando}>
              {cargando ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <div className="mt-2 text-center">
              <Link to="/register" className="d-block text-muted small">Crear cuenta</Link>
              <Link to="/forgot-password" className="d-block text-muted small">¿Olvidaste tu contraseña?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}