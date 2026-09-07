import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style_cliente.css";
import { apiFetch } from "../../utils/api";

function normalizarEstado(estado) {
  if (!estado) return "pendiente";
  const valor = String(estado).trim().toLowerCase();
  if (valor === "cancelado" || valor === "cancelada") return "cancelado";
  if (valor === "en camino" || valor === "enviado" || valor === "confirmado") return "enviado";
  if (valor === "entregado") return "entregado";
  if (valor === "pendiente" || valor === "en proceso") return "pendiente";
  return "pendiente";
}

function obtenerClaseEstado(estado) {
  const estadoNormalizado = normalizarEstado(estado);
  return estadoNormalizado === "enviado" ? "enviado" : estadoNormalizado === "entregado" ? "entregado" : estadoNormalizado === "cancelado" ? "cancelado" : "pendiente";
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

function obtenerImagenProducto(imagen) {
  if (!imagen) return "";
  if (imagen.startsWith("http")) return imagen;
  return `http://localhost:8080${imagen.startsWith("/") ? imagen : `/${imagen}`}`;
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [cancelandoId, setCancelandoId] = useState(null);
  const [pedidoPorCancelar, setPedidoPorCancelar] = useState(null);
  const [pedidoDetalleId, setPedidoDetalleId] = useState(null);

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

  async function cancelarPedido() {
    const pedido = pedidoPorCancelar;
    if (!pedido) return;
    const usuarioGuardado = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}") || {};
    setCancelandoId(pedido.id);
    setError("");
    try {
      const pedidoCancelado = await apiFetch(`/api/pedidos/${pedido.id}/cancelar`, {
        method: "PUT",
        body: JSON.stringify({ usuarioId: usuarioGuardado.id }),
      });
      setPedidos((anteriores) => anteriores.map((anterior) => anterior.id === pedido.id ? pedidoCancelado : anterior));
      setPedidoPorCancelar(null);
    } catch (err) {
      setError(err.message || "No se pudo cancelar el pedido.");
    } finally {
      setCancelandoId(null);
    }
  }

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
          const puedeCancelar = ["pendiente", "confirmado"].includes(String(estado).trim().toLowerCase());
          const mostrarDetalles = pedidoDetalleId === pedido.id;
          const fecha = pedido.fechaPedido || pedido.created_at || pedido.fecha_pedido;
          const total = Number(pedido.total || 0);

          return (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <div>
                  <p className="pedido-id">Pedido {pedido.codigo || pedido.id}</p>
                  <p className="pedido-fecha">{formatearFecha(fecha)}</p>
                </div>
                <div className="pedido-header-actions">
                  <span className={`pedido-estado ${obtenerClaseEstado(estado)}`}>{estado}</span>
                  <button
                    type="button"
                    className="pedido-detalle-btn"
                    onClick={() => setPedidoDetalleId(mostrarDetalles ? null : pedido.id)}
                    aria-expanded={mostrarDetalles}
                  >
                    <i className={`bi ${mostrarDetalles ? "bi-chevron-up" : "bi-chevron-down"}`} aria-hidden="true"></i>
                    {mostrarDetalles ? "Ocultar detalles" : "Ver detalles"}
                  </button>
                </div>
              </div>

              {mostrarDetalles && <div className="pedido-items pedido-items--details">
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
                    const descripcion = producto.descripcionCorta || producto.descripcion_corta || producto.descripcion || "Prenda seleccionada de nuestra colección.";
                    const categoria = producto.categoria?.tipoCategoria || producto.categoria || "Colección Camar";
                    const imagen = obtenerImagenProducto(producto.imagen);

                    return (
                      <div key={`${pedido.id}-${index}`} className="pedido-item-detail">
                        <div className="pedido-item-detail__image">
                          {imagen ? <img src={imagen} alt={nombreProducto} /> : <i className="bi bi-image" aria-hidden="true"></i>}
                        </div>
                        <div className="pedido-item-detail__info">
                          <div className="pedido-item-detail__topline">
                            <div>
                              <h4>{nombreProducto}</h4>
                              <p>{categoria}</p>
                            </div>
                            <strong>${formatearPrecio(precio * cantidad)}</strong>
                          </div>
                          <p className="pedido-item-detail__description">{descripcion}</p>
                          <div className="pedido-item-detail__meta">
                            <span><b>Talla</b> {talla}</span>
                            <span><b>Cantidad</b> {cantidad}</span>
                            <span><b>Precio unitario</b> ${formatearPrecio(precio)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>}

              <div className="pedido-footer">
                <div className="pedido-total">
                  <span className="pedido-total-label">Total del pedido</span>
                  <span className="pedido-total-val">${formatearPrecio(total)}</span>
                </div>
                {puedeCancelar && (
                  <button
                    type="button"
                    className="pedido-cancelar-btn"
                    onClick={() => setPedidoPorCancelar(pedido)}
                    disabled={cancelandoId === pedido.id}
                  >
                    <i className="bi bi-x-circle" aria-hidden="true"></i>
                    <span>{cancelandoId === pedido.id ? "Cancelando..." : "Cancelar pedido"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}

      {pedidoPorCancelar && (
        <div className="pedido-cancelar-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPedidoPorCancelar(null)}>
          <section className="pedido-cancelar-modal" role="dialog" aria-modal="true" aria-labelledby="cancelar-pedido-titulo">
            <button type="button" className="pedido-cancelar-close" onClick={() => setPedidoPorCancelar(null)} aria-label="Cerrar confirmación">×</button>
            <div className="pedido-cancelar-icon" aria-hidden="true"><i className="bi bi-exclamation-lg"></i></div>
            <p className="pedido-cancelar-eyebrow">Confirmar acción</p>
            <h3 id="cancelar-pedido-titulo">¿Cancelar este pedido?</h3>
            <p className="pedido-cancelar-copy">El pedido {pedidoPorCancelar.codigo || `#${pedidoPorCancelar.id}`} se cancelará y sus productos volverán a estar disponibles.</p>
            <div className="pedido-cancelar-actions">
              <button type="button" className="pedido-cancelar-no" onClick={() => setPedidoPorCancelar(null)}>Volver</button>
              <button type="button" className="pedido-cancelar-yes" onClick={cancelarPedido} disabled={cancelandoId === pedidoPorCancelar.id}>
                <i className="bi bi-x-circle" aria-hidden="true"></i>
                {cancelandoId === pedidoPorCancelar.id ? "Cancelando..." : "Sí, cancelar pedido"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
