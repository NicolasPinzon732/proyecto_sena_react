import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { obtenerCantidadCarrito } from "../../utils/cart";
import { validarCampoRegistro } from "../../utils/validacionesRegistro";

export default function AppCliente() {
  const location = useLocation();
  const navigate = useNavigate();

  const enCatalogo = location.pathname.startsWith("/cliente/catalogo") ||
                      location.pathname.startsWith("/cliente/producto");
  const enPedidos = location.pathname.startsWith("/cliente/pedidos");
  const enCarrito = location.pathname.startsWith("/cliente/carrito");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [campoEditable, setCampoEditable] = useState(null);
  const [usuario, setUsuario] = useState({
    nombres: "",
    apellidos: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [erroresPerfil, setErroresPerfil] = useState({});
  const [errorPerfil, setErrorPerfil] = useState("");
  const [confirmarSalida, setConfirmarSalida] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cartCount, setCartCount] = useState(obtenerCantidadCarrito());

  // Carga el perfil real del cliente al entrar
  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}")
      || {};

    if (!usuarioGuardado.id) {
      navigate("/login");
      return;
    }

    apiFetch(`/api/usuarios/${usuarioGuardado.id}`)
      .then((data) => {
        setUsuario({
          nombres: data.nombres || "",
          apellidos: data.apellidos || "",
          direccion: data.direccion || "",
          telefono: data.telefono || "",
          email: data.email || "",
        });
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  // Mantiene el contador del carrito actualizado, incluso si se agregan
  // productos desde el catálogo o el detalle de producto
  useEffect(() => {
    function actualizar() {
      setCartCount(obtenerCantidadCarrito());
    }
    window.addEventListener("carrito-actualizado", actualizar);
    return () => window.removeEventListener("carrito-actualizado", actualizar);
  }, []);

  function manejarCambio(campo, valor) {
    setUsuario((prev) => ({ ...prev, [campo]: valor }));
    setErroresPerfil((prev) => ({
      ...prev,
      [campo]: validarCampoRegistro(campo, valor),
    }));
  }

  function manejarPasswordNueva(valor) {
    setPasswordNueva(valor);
    setErroresPerfil((prev) => ({
      ...prev,
      password: valor && valor.length < 8 ? "La contraseña debe tener mínimo 8 caracteres." : "",
      confirmarPassword: confirmarPassword && valor !== confirmarPassword ? "Las contraseñas no coinciden." : "",
    }));
  }

  async function guardarCambios(e) {
    e.preventDefault();
    setErrorPerfil("");
    const errores = {};
    ["nombres", "apellidos", "email", "telefono"].forEach((campo) => {
      const error = validarCampoRegistro(campo, usuario[campo] || "");
      if (error) errores[campo] = error;
    });

    if (!usuario.direccion.trim()) errores.direccion = "La dirección es obligatoria.";
    if (passwordNueva && passwordNueva.length < 8) errores.password = "La contraseña debe tener mínimo 8 caracteres.";
    if (passwordNueva && passwordNueva !== confirmarPassword) errores.confirmarPassword = "Las contraseñas no coinciden.";

    setErroresPerfil(errores);
    if (Object.keys(errores).length) {
      setErrorPerfil(Object.values(errores)[0]);
      return;
    }

    setGuardando(true);
    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}") || {};

      await apiFetch(`/api/usuarios/${usuarioGuardado.id}`, {
        method: "PUT",
        body: JSON.stringify({
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          telefono: usuario.telefono,
          email: usuario.email,
          password: passwordNueva || undefined,
        }),
      });

      if (passwordNueva) {
        setPasswordNueva("");
        setConfirmarPassword("");
      }

      setModalAbierto(false);
      setCampoEditable(null);
      setErroresPerfil({});
      setErrorPerfil("");
    } catch (error) {
      setErrorPerfil(error.message || "No se pudieron guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  }

  function cerrarSesion() {
    setConfirmarSalida(true);
  }

  function confirmarCerrarSesion() {
    localStorage.removeItem("user");
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    sessionStorage.setItem("salida-confirmada", "true");
    window.location.replace("/");
  }

  return (
    <>
      <nav className="navbar-cliente">
        <div className="nav-brand">
          <img src="/logo.png" alt="Logo" className="brand-logo" />
          <span className="brand-name">Creaciones Camar</span>
        </div>

        <div className="nav-links">
          <Link to="/cliente/catalogo" className={`nav-link-item ${enCatalogo ? "active" : ""}`}>
            Catálogo
          </Link>
          <Link to="/cliente/pedidos" className={`nav-link-item ${enPedidos ? "active" : ""}`}>
            Mis pedidos
          </Link>
        </div>

        <div className="nav-actions">
          <Link to="/cliente/carrito" className={`nav-icon-btn ${enCarrito ? "active" : ""}`} title="Carrito">
            <i className="bi bi-cart3"></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button className="nav-icon-btn" onClick={() => setModalAbierto(true)} title="Perfil">
            <i className="bi bi-person-circle"></i>
          </button>
          <button className="nav-icon-btn" onClick={cerrarSesion} title="Cerrar sesión" style={{ background: "none", border: "none" }}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </nav>

      <Outlet />

      <div className={`modal-overlay ${modalAbierto ? "show" : ""}`} onMouseDown={(e) => e.target === e.currentTarget && setModalAbierto(false)}>
        <div className="modal-user" role="dialog" aria-modal="true" aria-labelledby="perfil-titulo">
          <button
            className="modal-close"
            onClick={() => setModalAbierto(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
          <div className="user-avatar-lg">
            <i className="bi bi-person-fill"></i>
          </div>
          <p className="profile-kicker">Mi cuenta</p>
          <h5 className="modal-user-title" id="perfil-titulo">Datos del usuario</h5>
          <p className="profile-intro">Actualiza tus datos personales de forma segura.</p>

          {errorPerfil && (
            <div className="app-validation-alert alert alert-danger" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>
              {errorPerfil}
            </div>
          )}

          <form onSubmit={guardarCambios}>
            <div className="user-field-group">
              {[
                { campo: "nombres", label: "Nombres", tipo: "text" },
                { campo: "apellidos", label: "Apellidos", tipo: "text" },
                { campo: "direccion", label: "Dirección", tipo: "text" },
                { campo: "telefono", label: "Teléfono", tipo: "text" },
                { campo: "email", label: "Correo", tipo: "email" },
              ].map(({ campo, label, tipo }) => (
                <div key={campo}>
                  <label>{label}</label>
                  <div className="user-field">
                    <input
                      type={tipo}
                      value={usuario[campo] || ""}
                      disabled={campoEditable !== campo}
                      onChange={(e) => manejarCambio(campo, e.target.value)}
                    />
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() =>
                        setCampoEditable(campoEditable === campo ? null : campo)
                      }
                    >
                      <i
                        className={`bi ${
                          campoEditable === campo ? "bi-check-lg" : "bi-pencil"
                        }`}
                      ></i>
                    </button>
                  </div>
                  {erroresPerfil[campo] && <small className="profile-field-error">{erroresPerfil[campo]}</small>}
                </div>
              ))}

              <label>Contraseña</label>
              <div className="user-field">
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={passwordNueva}
                  disabled={campoEditable !== "password"}
                  onChange={(e) => manejarPasswordNueva(e.target.value)}
                />
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() =>
                    setCampoEditable(
                      campoEditable === "password" ? null : "password"
                    )
                  }
                >
                  <i
                    className={`bi ${
                      campoEditable === "password" ? "bi-check-lg" : "bi-pencil"
                    }`}
                  ></i>
                </button>
              </div>
              {erroresPerfil.password && <small className="profile-field-error">{erroresPerfil.password}</small>}

              {campoEditable === "password" && (
                <div className="user-field">
                  <label htmlFor="confirmar-password">Confirmar contraseña nueva</label>
                  <input
                    id="confirmar-password"
                    type="password"
                    placeholder="Repite la nueva contraseña"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                  />
                  {erroresPerfil.confirmarPassword && <small className="profile-field-error">{erroresPerfil.confirmarPassword}</small>}
                </div>
              )}
            </div>

            <div className="mt-3 text-center">
              <button type="submit" className="btn btn-main px-4" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {confirmarSalida && (
        <div className="logout-confirm-overlay" role="presentation">
          <div className="logout-confirm" role="dialog" aria-modal="true" aria-labelledby="logout-title">
            <div className="logout-confirm__icon"><i className="bi bi-box-arrow-right"></i></div>
            <h5 id="logout-title">¿Seguro que deseas salir?</h5>
            <p>Tu sesión se cerrará y tendrás que iniciar sesión nuevamente para volver a tu cuenta.</p>
            <div className="logout-confirm__actions">
              <button type="button" className="logout-confirm__cancel" onClick={() => setConfirmarSalida(false)}>Cancelar</button>
              <button type="button" className="logout-confirm__accept" onClick={confirmarCerrarSesion}>Sí, salir</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
