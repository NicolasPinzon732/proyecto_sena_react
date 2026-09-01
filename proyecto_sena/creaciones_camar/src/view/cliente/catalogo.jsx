import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style_cliente.css";
import { apiFetch } from "../../utils/api";

function obtenerNombre(producto) {
  if (typeof producto.nombre === "string") return producto.nombre;
  if (producto.nombre && typeof producto.nombre === "object") {
    return producto.nombre.nombre || producto.nombre.material || producto.nombre.modelo_chaqueta || "";
  }
  return producto.nombre || producto.modelo_chaqueta || "";
}

function obtenerImagen(imagen) {
  if (!imagen) return "";
  if (imagen.startsWith("http") || imagen.startsWith("/")) return imagen;
  return `http://localhost:8000${imagen}`;
}

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/productos")
      .then((data) => setProductos(data.filter((p) => p.activo !== false)))
      .catch((err) => setError(err.message || "No se pudieron cargar los productos."))
      .finally(() => setCargando(false));
  }, []);

  const categorias = [...new Set(productos.map((p) => p.categoria?.tipoCategoria || p.categoria).filter(Boolean))];

  const productosFiltrados = productos.filter((producto) => {
    const nombre = obtenerNombre(producto).toLowerCase();
    const categoriaProducto = producto.categoria?.tipoCategoria || producto.categoria || "";
    const coincideTexto = nombre.includes(busqueda.toLowerCase());
    const coincideCategoria = !categoriaActiva || categoriaProducto === categoriaActiva;
    return coincideTexto && coincideCategoria;
  });

  return (
    <>
      <section className="hero-banner">
        <div className="hero-content">
          <p className="hero-tag">Nueva colección 2025</p>
          <h1 className="hero-title">
            Colección de
            <br />
            <em>chaquetas</em>
          </h1>
          <p className="hero-sub">Descubre nuestra selección premium de chaquetas para cada ocasión</p>
        </div>
        <div className="hero-decoration"></div>
      </section>

      <div className="catalog-container">
        <div className="search-filter-bar">
          <div className="search-wrap">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar chaquetas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            <button className={`pill ${categoriaActiva === "" ? "active" : ""}`} onClick={() => setCategoriaActiva("")}>Todas</button>
            {categorias.map((cat) => (
              <button key={cat} className={`pill ${categoriaActiva === cat ? "active" : ""}`} onClick={() => setCategoriaActiva(cat)}>{cat}</button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {cargando ? <p className="text-muted">Cargando productos...</p> : (
          <div className="products-grid">
            {productosFiltrados.length === 0 ? (
              <div className="col-12 text-center text-muted py-5">
                <i className="bi bi-box fs-2 d-block mb-2"></i>
                No hay productos disponibles.
              </div>
            ) : (
              productosFiltrados.map((producto) => (
                <Link key={producto.id} to={`/cliente/producto/${producto.id}`} className="product-card">
                  <div className="product-img-wrap">
                    {producto.imagen ? (
                      <img src={obtenerImagen(producto.imagen)} alt={obtenerNombre(producto)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div className="product-img-placeholder"><i className="bi bi-image"></i></div>
                    )}
                    <span className="product-category-badge">{producto.categoria?.tipoCategoria || producto.categoria || "General"}</span>
                  </div>

                  <div className="product-info">
                    <div className="product-top">
                      <div>
                        <p className="product-name">{obtenerNombre(producto)}</p>
                        <p className="product-desc">{producto.descripcion_corta}</p>
                      </div>
                      <span className={`product-status ${producto.stock_total > 0 ? "disponible" : "agotado"}`}>
                        {producto.stock_total > 0 ? "Disponible" : "Agotado"}
                      </span>
                    </div>
                    <div className="product-bottom">
                      <span className="product-price">${Number(producto.precio || 0).toLocaleString("es-CO")}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}