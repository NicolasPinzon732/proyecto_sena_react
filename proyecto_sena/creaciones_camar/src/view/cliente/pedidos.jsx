import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style_cliente.css";
import { apiFetch } from "../../utils/api";

function normalizarEstado(estado) {
  if (!estado) return "pendiente";
  const valor = String(estado).trim().toLowerCase();
  if (valor === "en camino" || valor === "enviado" || valor === "confirmado") return "enviado";
  if (valor === "entregado") return "entregado";
  if (valor === "pendiente" || valor === "en proceso") return "pendiente";
  return "pendiente";
}

function obtenerClaseEstado(estado) {
  return normalizarEstado(estado) === "enviado" ? "enviado" : normalizarEstado(estado) === "entregado" ? "entregado" : "pendiente";
}

function formatearFecha(fechaTexto) {
  if (!fechaTexto) return "Sin fecha";
  const fecha = new Date(fechaTexto);
  if (Number.isNaN(fecha.getTime())) return "Sin fecha";
  return fecha.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

function formatearPrecio(precio) {
  const valor = Number(precio || 0);
  return new Intl.NumberFormat("es-CO").format(valor);
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}") || {};
    if (!usuarioGuardado.id) {
      setCargando(false);
      setError("Debes iniciar sesión para ver tus pedidos.");
      return;
    }

    apiFetch(`/api/pedidos/usuario/${usuarioGuardado.id}`)
      .then((lista) => setPedidos(Array.isArray(lista) ? lista : []))
      .catch((err) => setError(err.message || "No se pudieron cargar los pedidos."))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="pedidos-container">
      <h2 className="section-title" style={{ marginBottom: 24 }}>Mis pedidos</h2>

      {cargando && <p className="text-muted">Cargando pedidos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!cargando && !error && pedidos.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-bag-x fs-2 d-block mb-2"></i>
          Aún no tienes pedidos.
          <br />
          <Link to="/cliente/catalogo" className="btn btn-main mt-3">Ir al catálogo</Link>
        </div>
      ) : (
        pedidos.map((pedido) => {
          const detallePedido = pedido.detalles || pedido.items || [];
          const estado = pedido.estado || "pendiente";
          const fecha = pedido.fechaPedido || pedido.created_at || pedido.fecha_pedido;
          const total = Number(pedido.total || 0);

          return (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <div>
                  <p className="pedido-id">Pedido {pedido.codigo || pedido.id}</p>
                  <p className="pedido-fecha">{formatearFecha(fecha)}</p>
                </div>
                <span className={`pedido-estado ${obtenerClaseEstado(estado)}`}>{estado}</span>
              </div>

              <div className="pedido-items">
                {detallePedido.length === 0 ? (
                  <div className="pedido-item-row">
                    <span>Sin detalles de pedido</span>
                  </div>
                ) : (
                  detallePedido.map((item, index) => {
                    const producto = item.producto || item.productoDetalle || {};
                    const cantidad = Number(item.cantidad || 0);
                    const precio = Number(producto.precio || item.precioUnitario || 0);
                    const talla = item.talla || "Única";
                    const nombreProducto = producto.nombre || "Producto";

                    return (
                      <div key={`${pedido.id}-${index}`} className="pedido-item-row">
                        <span>{nombreProducto} — Talla {talla}</span>
                        <span>x{cantidad} ${formatearPrecio(precio * cantidad)}</span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pedido-footer">
                <span className="pedido-total-label">Total del pedido</span>
                <span className="pedido-total-val">${formatearPrecio(total)}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
