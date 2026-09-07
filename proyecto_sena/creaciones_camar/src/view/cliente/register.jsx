import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { validarRegistroCompleto } from "../utils/validacionesRegistro";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    p_nom_usuario: "",
    p_ape_usuario: "",
    nuip: "",
    correo: "",
    telefono: "",
    password: "",
    confirmarPassword: "",
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    setError("");
    setExito("");

    const validacion = validarRegistroCompleto({
      nombres: form.p_nom_usuario,
      apellidos: form.p_ape_usuario,
      nuip: form.nuip,
      email: form.correo,
      telefono: form.telefono,
      password: form.password,
      confirmPassword: form.confirmarPassword,
    });
    setErrores(validacion);
    if (Object.keys(validacion).length > 0) {
      const mensaje = Object.values(validacion)[0];
      setError(mensaje);
      return;
    }

    setCargando(true);
    try {
      await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({
          p_nom_usuario: form.p_nom_usuario,
          p_ape_usuario: form.p_ape_usuario,
          nuip: form.nuip,
          correo: form.correo,
          telefono: form.telefono || undefined,
          password: form.password,
        }),
      });

      setExito("Cuenta creada con éxito. Ya puedes iniciar sesión.");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message || "No se pudo crear la cuenta.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center login-container">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card login-card text-center">
          <h5 className="mb-4">Crea tu cuenta en Creaciones Camar</h5>

          {error && <div className="alert alert-danger">{error}</div>}
          {exito && <div className="alert alert-success">{exito}</div>}

          <form onSubmit={manejarSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="p_nom_usuario"
                className="form-control"
                placeholder="Nombre"
                value={form.p_nom_usuario}
                onChange={manejarCambio}
              />
              {errores.nombres && <small className="register-field-error">{errores.nombres}</small>}
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="p_ape_usuario"
                className="form-control"
                placeholder="Apellido"
                value={form.p_ape_usuario}
                onChange={manejarCambio}
              />
              {errores.apellidos && <small className="register-field-error">{errores.apellidos}</small>}
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="nuip"
                className="form-control"
                placeholder="NUIP"
                value={form.nuip}
                onChange={manejarCambio}
                maxLength="15"
                inputMode="numeric"
              />
              {errores.nuip && <small className="register-field-error">{errores.nuip}</small>}
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="correo"
                className="form-control"
                placeholder="Correo"
                value={form.correo}
                onChange={manejarCambio}
              />
              {errores.email && <small className="register-field-error">{errores.email}</small>}
            </div>

            <div className="mb-3">
              <input
                type="tel"
                name="telefono"
                className="form-control"
                placeholder="Teléfono (opcional)"
                value={form.telefono}
                onChange={manejarCambio}
              />
              {errores.telefono && <small className="register-field-error">{errores.telefono}</small>}
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Contraseña"
                value={form.password}
                onChange={manejarCambio}
              />
              {errores.password && <small className="register-field-error">{errores.password}</small>}
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="confirmarPassword"
                className="form-control"
                placeholder="Confirmar contraseña"
                value={form.confirmarPassword}
                onChange={manejarCambio}
              />
              {errores.confirmPassword && <small className="register-field-error">{errores.confirmPassword}</small>}
            </div>

            <button type="submit" className="btn btn-main w-100 mb-3" disabled={cargando}>
              {cargando ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <div className="mt-2 text-center">
              <Link to="/" className="d-block text-muted small">
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}