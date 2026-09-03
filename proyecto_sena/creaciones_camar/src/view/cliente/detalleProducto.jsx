import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../styles/style_cliente.css";
import { apiFetch } from "../../utils/api";
import { agregarAlCarrito } from "../../utils/cart";

function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-CO").format(precio);
}

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    apiFetch(`/api/productos/${id}`)
      .then((data) => {
        setProducto(data);
        const tallas = Array.isArray(data?.tallas)
          ? data.tallas
          : typeof data?.tallas === 'string'
            ? data.tallas.split(',').map((t) => t.trim()).filter(Boolean)
            : [];
        setTallaSeleccionada(tallas[0] || "");
      })
      .catch((err) => setError(err.message || "No se pudo cargar el producto."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="catalog-container"><p className="text-muted">Cargando producto...</p></div>;
  if (error || !producto) {
    return (
      <div className="catalog-container">
        <div className="alert alert-danger">{error || "Producto no encontrado."}</div>
        <Link to="/cliente/catalogo" className="btn btn-main mt-3">Volver al catálogo</Link>
      </div>
    );
  }

  const tallasDisponibles = Array.isArray(producto.tallas)
    ? producto.tallas
    : typeof producto.tallas === 'string'
      ? (() => {
          try {
            const tallas = JSON.parse(producto.tallas);
            if (Array.isArray(tallas)) return tallas;
          } catch {
            const nombres = producto.tallas.split(',').map((t) => t.trim()).filter(Boolean);
            const stock = Number(producto.stockTotal || 0);
            const base = nombres.length ? Math.floor(stock / nombres.length) : 0;
            const sobrante = nombres.length ? stock % nombres.length : 0;
            return nombres.map((talla, index) => ({ talla, cantidad: base + (index < sobrante ? 1 : 0) }));
          }
          return [];
        })()
      : [];

  const stockActual = tallasDisponibles.find((item) => item.talla === tallaSeleccionada)?.cantidad || producto.stockTotal || 0;

  const handleAgregar = () => {
    if (!tallaSeleccionada) {
      setError("Selecciona una talla antes de agregar al carrito.");
      return;
    }

    if (stockActual <= 0) {
      setError("La talla seleccionada no tiene stock disponible.");
      return;
    }

    setAgregando(true);
    agregarAlCarrito(
      { id: producto.id, nombre: producto.nombre, precio: Number(producto.precio), imagen: producto.imagen },
      tallaSeleccionada,
      cantidad
    );

    setTimeout(() => {
      setAgregando(false);
      navigate("/cliente/carrito");
    }, 200);
  };

  return (
    <div className="catalog-container">
      <Link to="/cliente/catalogo" className="btn btn-outline-secondary mb-4">← Volver</Link>

      <div className="detalle-grid">
        <div className="detalle-img-wrap">
          {producto.imagen ? (
            <img src={`http://localhost:8000${producto.imagen}`} alt={producto.nombre} />
          ) : (
            <div className="detalle-img-placeholder"><i className="bi bi-image"></i></div>
          )}
        </div>

        <div className="detalle-info">
          <p className="detalle-cat">{producto.categoria?.tipoCategoria || producto.categoria || "Chaqueta"}</p>
          <h1 className="detalle-nombre">{producto.nombre}</h1>
          <p className="detalle-desc">{producto.descripcionCorta || producto.descripcion || "Sin descripción."}</p>
          <div className="detalle-precio">$ {formatearPrecio(producto.precio)}</div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div>
            <p className="detalle-section-label">Talla</p>
            <div className="tallas-wrap">
              {tallasDisponibles.length ? (
                tallasDisponibles.map((item) => (
                  <button
                    key={item.talla}
                    type="button"
                    className={`talla-btn ${tallaSeleccionada === item.talla ? "active" : ""}`}
                    onClick={() => setTallaSeleccionada(item.talla)}
                    disabled={(item.cantidad || 0) <= 0}
                    style={{ opacity: (item.cantidad || 0) <= 0 ? 0.5 : 1 }}
                  >
                    {item.talla}
                    <small>{item.cantidad || 0} disp.</small>
                  </button>
                ))
              ) : (
                <span className="text-muted">Sin tallas disponibles</span>
              )}
            </div>
          </div>

          <div>
            <p className="detalle-section-label">Cantidad</p>
            <div className="cantidad-wrap">
              <button type="button" className="cantidad-btn" onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}>-</button>
              <span className="cantidad-num">{cantidad}</span>
              <button type="button" className="cantidad-btn" onClick={() => setCantidad((prev) => Math.min(stockActual || 1, prev + 1))}>+</button>
            </div>
          </div>

          <button type="button" className="btn-agregar" onClick={handleAgregar} disabled={agregando}>
            {agregando ? "Añadiendo..." : "Agregar al carrito"}
          </button>

          <div>
            <p className="detalle-section-label">Materiales</p>
            <div className="materiales-wrap">
              {producto.materiales?.length ? (
                producto.materiales.map((material) => <span key={material} className="material-tag">{material}</span>)
              ) : (
                <span className="text-muted">Sin material definido</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}