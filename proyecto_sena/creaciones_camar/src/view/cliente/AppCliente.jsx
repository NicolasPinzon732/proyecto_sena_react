import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { obtenerCantidadCarrito } from "../../utils/cart";

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
  }

  async function guardarCambios(e) {
    e.preventDefault();
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
      }

      setModalAbierto(false);
      setCampoEditable(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setGuardando(false);
    }
  }

  function cerrarSesion() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      <nav className="navbar-cliente">
        <div className="nav-brand">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: 65, height: 65, objectFit: "contain" }}
          />
          <span className="brand-name">Creaciones Camar</span>
        </div>

        <div className="nav-links">
          <Link
            to="/cliente/catalogo"
            className={`nav-link-item ${enCatalogo ? "active" : ""}`}
          >
            Catálogo
          </Link>
          <Link
            to="/cliente/pedidos"
            className={`nav-link-item ${enPedidos ? "active" : ""}`}
          >
            Mis pedidos
          </Link>
        </div>

        <div className="nav-actions">
          <Link
            to="/cliente/carrito"
            className={`nav-icon-btn ${enCarrito ? "active" : ""}`}
            title="Carrito"
          >
            <i className="bi bi-cart3"></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button
            className="nav-icon-btn"
            onClick={() => setModalAbierto(true)}
            title="Perfil"
          >
            <i className="bi bi-person-circle"></i>
          </button>

          <button
            className="nav-icon-btn"
            onClick={cerrarSesion}
            title="Cerrar sesión"
            style={{ background: "none", border: "none" }}
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </nav>

      <Outlet />

      <div className={`modal-overlay ${modalAbierto ? "show" : ""}`}>
        <div className="modal-user">
          <button
            className="modal-close"
            onClick={() => setModalAbierto(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
          <div className="user-avatar-lg">
            <i className="bi bi-person-fill"></i>
          </div>
          <h5 className="modal-user-title">Datos del usuario</h5>

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
                </div>
              ))}

              <label>Contraseña</label>
              <div className="user-field">
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={passwordNueva}
                  disabled={campoEditable !== "password"}
                  onChange={(e) => setPasswordNueva(e.target.value)}
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
            </div>

            <div className="mt-3 text-center">
              <button type="submit" className="btn btn-main px-4" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
