import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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

const MONEDAS_PAIS = {
  Argentina: { moneda: "ARS", locale: "es-AR", tasaCop: 0.29 },
  Bolivia: { moneda: "BOB", locale: "es-BO", tasaCop: 0.0025 },
  Brasil: { moneda: "BRL", locale: "pt-BR", tasaCop: 0.0013 },
  Chile: { moneda: "CLP", locale: "es-CL", tasaCop: 0.23 },
  Colombia: { moneda: "COP", locale: "es-CO", tasaCop: 1 },
  Ecuador: { moneda: "USD", locale: "es-EC", tasaCop: 0.00025 },
  Paraguay: { moneda: "PYG", locale: "es-PY", tasaCop: 1.85 },
  Perú: { moneda: "PEN", locale: "es-PE", tasaCop: 0.00094 },
  Uruguay: { moneda: "UYU", locale: "es-UY", tasaCop: 0.010 },
  México: { moneda: "MXN", locale: "es-MX", tasaCop: 0.0043 },
};

function obtenerMoneda(pais) {
  return MONEDAS_PAIS[pais] || MONEDAS_PAIS.Colombia;
}

function formatearPrecio(precio, pais = "Colombia") {
  const configuracion = obtenerMoneda(pais);
  const valor = Number(precio || 0) * configuracion.tasaCop;
  return new Intl.NumberFormat(configuracion.locale, {
    style: "currency",
    currency: configuracion.moneda,
    maximumFractionDigits: ["COP", "CLP", "PYG"].includes(configuracion.moneda) ? 0 : 2,
  }).format(valor);
}

function obtenerImagenProducto(imagen) {
  if (!imagen) return "";
  if (imagen.startsWith("http")) return imagen;
  return `http://localhost:8080${imagen.startsWith("/") ? imagen : `/${imagen}`}`;
}

function obtenerDetalles(pedido) {
  return pedido.detalles || pedido.items || [];
}

function obtenerPrecioDetalle(detalle) {
  return Number(detalle.producto?.precio || detalle.precioUnitario || 0);
}

function formatearFechaCompleta(fechaTexto) {
  if (!fechaTexto) return "Sin fecha";
  const fecha = new Date(fechaTexto);
  if (Number.isNaN(fecha.getTime())) return "Sin fecha";
  return fecha.toLocaleString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function descargarRecibo(pedido) {
  const doc = new jsPDF();
  const detalles = obtenerDetalles(pedido);
  const pais = pedido.pais || "Colombia";
  const moneda = obtenerMoneda(pais).moneda;
  const total = Number(pedido.total || 0);
  const subtotal = Math.max(0, total - 12000);
  const numeroPedido = pedido.codigo || pedido.id;
  const filas = detalles.map((detalle) => [
    detalle.producto?.nombre || "Producto",
    detalle.talla || "Única",
    String(Number(detalle.cantidad || 0)),
    formatearPrecio(obtenerPrecioDetalle(detalle), pais),
    formatearPrecio(obtenerPrecioDetalle(detalle) * Number(detalle.cantidad || 0), pais),
  ]);

  doc.setFillColor(80, 109, 47);
  doc.rect(0, 0, 210, 34, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("CAMAR", 16, 16);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Recibo de compra", 16, 24);
  doc.text(`Pedido #${numeroPedido}`, 194, 17, { align: "right" });
  doc.text(formatearFechaCompleta(pedido.fechaPedido || pedido.created_at || pedido.fecha_pedido), 194, 24, { align: "right" });

  doc.setTextColor(45, 55, 40);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Detalle del pedido", 16, 48);
  autoTable(doc, {
    startY: 54,
    head: [["Producto", "Talla", "Cantidad", "Precio unitario", "Total"]],
    body: filas.length ? filas : [["Sin detalles", "-", "-", "-", "-"]],
    theme: "grid",
    headStyles: { fillColor: [80, 109, 47], textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  const resumenY = (doc.lastAutoTable?.finalY || 65) + 12;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Subtotal: ${formatearPrecio(subtotal, pais)}`, 194, resumenY, { align: "right" });
  doc.text(`Envío: ${formatearPrecio(12000, pais)}`, 194, resumenY + 7, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total: ${formatearPrecio(total, pais)}`, 194, resumenY + 17, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 100, 85);
  const datosY = resumenY + 34;
  doc.text(`Estado: ${pedido.estado || "pendiente"}`, 16, datosY);
  doc.text(`Moneda: ${moneda} (${pais})`, 16, datosY + 21);
  doc.text(`Método de pago: ${pedido.metodoPago?.nombre || pedido.metodoPagoNombre || "No especificado"}`, 16, datosY + 7);
  doc.text(`Entrega: ${[pedido.direccion, pedido.ciudad, pedido.pais].filter(Boolean).join(", ") || "No especificada"}`, 16, datosY + 14);
  doc.text("Gracias por comprar en Creaciones Camar.", 16, datosY + 35);
  doc.save(`recibo-pedido-${numeroPedido}.pdf`);
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [cancelandoId, setCancelandoId] = useState(null);
  const [pedidoPorCancelar, setPedidoPorCancelar] = useState(null);
  const [pedidoDetalleId, setPedidoDetalleId] = useState(null);
  const [pedidoRecibo, setPedidoRecibo] = useState(null);

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
          const detallePedido = obtenerDetalles(pedido);
          const estado = pedido.estado || "pendiente";
          const puedeCancelar = ["pendiente", "confirmado"].includes(String(estado).trim().toLowerCase());
          const mostrarDetalles = pedidoDetalleId === pedido.id;
          const fecha = pedido.fechaPedido || pedido.created_at || pedido.fecha_pedido;
          const total = Number(pedido.total || 0);
          const pais = pedido.pais || "Colombia";

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
                            <strong>{formatearPrecio(precio * cantidad, pais)}</strong>
                          </div>
                          <p className="pedido-item-detail__description">{descripcion}</p>
                          <div className="pedido-item-detail__meta">
                            <span><b>Talla</b> {talla}</span>
                            <span><b>Cantidad</b> {cantidad}</span>
                            <span><b>Precio unitario</b> {formatearPrecio(precio, pais)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>}

              <div className="pedido-footer">
                <div className="pedido-footer-summary">
                  <div className="pedido-total">
                    <span className="pedido-total-label">Total del pedido</span>
                    <span className="pedido-total-val">{formatearPrecio(total, pais)}</span>
                  </div>
                  <button type="button" className="pedido-recibo-btn" onClick={() => setPedidoRecibo(pedido)}>
                    <i className="bi bi-receipt" aria-hidden="true"></i>
                    Ver recibo
                  </button>
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

      {pedidoRecibo && (
        <div className="pedido-recibo-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPedidoRecibo(null)}>
          <section className="pedido-recibo-modal" role="dialog" aria-modal="true" aria-labelledby="recibo-pedido-titulo">
            <button type="button" className="pedido-recibo-close" onClick={() => setPedidoRecibo(null)} aria-label="Cerrar recibo">×</button>
            <div className="pedido-recibo-heading">
              <div className="pedido-recibo-brand"><i className="bi bi-bag-heart" aria-hidden="true"></i> CAMAR</div>
              <span>Recibo de compra</span>
            </div>
            <div className="pedido-recibo-number">
              <div><small>Pedido</small><strong id="recibo-pedido-titulo">#{pedidoRecibo.codigo || pedidoRecibo.id}</strong></div>
              <div><small>Fecha</small><strong>{formatearFechaCompleta(pedidoRecibo.fechaPedido || pedidoRecibo.created_at || pedidoRecibo.fecha_pedido)}</strong></div>
              <span className={`pedido-estado ${obtenerClaseEstado(pedidoRecibo.estado)}`}>{pedidoRecibo.estado || "pendiente"}</span>
            </div>

            <div className="pedido-recibo-info">
              <div><small>Entrega</small><strong>{[pedidoRecibo.direccion, pedidoRecibo.ciudad, pedidoRecibo.pais].filter(Boolean).join(", ") || "No especificada"}</strong></div>
              <div><small>Moneda</small><strong>{obtenerMoneda(pedidoRecibo.pais).moneda} ({pedidoRecibo.pais || "Colombia"})</strong></div>
              <div><small>Método de pago</small><strong>{pedidoRecibo.metodoPago?.nombre || pedidoRecibo.metodoPagoNombre || "No especificado"}</strong></div>
            </div>

            <div className="pedido-recibo-products">
              {obtenerDetalles(pedidoRecibo).map((detalle, index) => {
                const cantidad = Number(detalle.cantidad || 0);
                const precio = obtenerPrecioDetalle(detalle);
                return (
                  <div className="pedido-recibo-product" key={`${pedidoRecibo.id}-recibo-${index}`}>
                    <div><strong>{detalle.producto?.nombre || "Producto"}</strong><small>Talla {detalle.talla || "Única"} · Cantidad {cantidad}</small></div>
                    <span>{formatearPrecio(precio * cantidad, pedidoRecibo.pais)}</span>
                  </div>
                );
              })}
            </div>

            <div className="pedido-recibo-totals">
              <div><span>Subtotal</span><span>{formatearPrecio(Math.max(0, Number(pedidoRecibo.total || 0) - 12000), pedidoRecibo.pais)}</span></div>
              <div><span>Envío</span><span>{formatearPrecio(12000, pedidoRecibo.pais)}</span></div>
              <div className="pedido-recibo-total"><strong>Total</strong><strong>{formatearPrecio(Number(pedidoRecibo.total || 0), pedidoRecibo.pais)}</strong></div>
            </div>
            <button type="button" className="pedido-recibo-download" onClick={() => descargarRecibo(pedidoRecibo)}>
              <i className="bi bi-file-earmark-pdf" aria-hidden="true"></i>
              Descargar recibo en PDF
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
