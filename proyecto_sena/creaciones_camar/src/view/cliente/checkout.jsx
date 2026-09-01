import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/style_cliente.css";
import { apiFetch } from "../../utils/api";
import { obtenerCarrito, vaciarCarrito } from "../../utils/cart";

const COSTO_ENVIO = 12000;

function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-CO").format(precio);
}

export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => obtenerCarrito());
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    codigo_postal: "",
    telefono: "",
    metodo_pago: "Nequi",
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!items.length) {
      navigate("/cliente/carrito");
      return;
    }
  }, [items, navigate]);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + Number(item.producto?.precio || 0) * Number(item.cantidad || 0), 0),
    [items]
  );

  const total = subtotal + COSTO_ENVIO;

  function actualizarCampo(valor, campo) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function confirmarPedido(event) {
    event.preventDefault();

    if (!items.length) {
      setError("Tu carrito está vacío.");
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}") || {};

      await apiFetch("/api/pedidos", {
        method: "POST",
        body: JSON.stringify({
          usuario: { id: usuarioGuardado.id },
          total,
          estado: "pendiente",
          pais: "Colombia",
          ciudad: form.ciudad,
          direccion: form.direccion,
          codigoPostal: form.codigo_postal,
          detalles: items.map((item) => ({
            producto: { id: item.producto?.id },
            cantidad: Number(item.cantidad),
            precioUnitario: Number(item.producto?.precio || 0),
            talla: item.talla,
          })),
        }),
      });

      vaciarCarrito();
      navigate("/cliente/pedidos");
    } catch (err) {
      setError(err.message || "No se pudo procesar el pedido.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="carrito-container" style={{ gridTemplateColumns: "1.3fr 0.7fr" }}>
      <div>
        <h2 className="section-title">Confirmar compra</h2>

        <form onSubmit={confirmarPedido} className="resumen-card" style={{ padding: "24px" }}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label className="form-label fw-bold">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              value={form.nombre}
              onChange={(e) => actualizarCampo(e.target.value, "nombre")}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Dirección</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Calle 15 #20-35"
              value={form.direccion}
              onChange={(e) => actualizarCampo(e.target.value, "direccion")}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Ciudad</label>
              <input
                type="text"
                className="form-control"
                value={form.ciudad}
                onChange={(e) => actualizarCampo(e.target.value, "ciudad")}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Código postal</label>
              <input
                type="text"
                className="form-control"
                value={form.codigo_postal}
                onChange={(e) => actualizarCampo(e.target.value, "codigo_postal")}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Teléfono</label>
            <input
              type="tel"
              className="form-control"
              value={form.telefono}
              onChange={(e) => actualizarCampo(e.target.value, "telefono")}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Método de pago</label>
            <select
              className="form-select"
              value={form.metodo_pago}
              onChange={(e) => actualizarCampo(e.target.value, "metodo_pago")}
            >
              <option value="Nequi">Nequi</option>
              <option value="Daviplata">Daviplata</option>
              <option value="Transferencia Bancaria">Transferencia Bancaria</option>
              <option value="PayPal">PayPal</option>
              <option value="Mercado Pago">Mercado Pago</option>
            </select>
          </div>

          <div className="d-flex gap-2 flex-wrap mt-4">
            <button type="submit" className="btn-pagar" disabled={guardando} style={{ width: "auto" }}>
              {guardando ? "Procesando..." : "Confirmar pedido"}
            </button>
            <Link to="/cliente/carrito" className="btn-seguir" style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", width: "auto" }}>
              Volver al carrito
            </Link>
          </div>
        </form>
      </div>

      <aside className="resumen-card">
        <p className="resumen-title">Resumen</p>
        {items.map((item) => (
          <div key={item.key} className="resumen-row" style={{ marginBottom: "10px" }}>
            <span>
              {item.producto?.nombre} <small>x{item.cantidad}</small>
            </span>
            <span>${formatearPrecio(Number(item.producto?.precio || 0) * Number(item.cantidad || 0))}</span>
          </div>
        ))}
        <div className="resumen-row"><span>Subtotal</span><span>${formatearPrecio(subtotal)}</span></div>
        <div className="resumen-row"><span>Envío</span><span>${formatearPrecio(COSTO_ENVIO)}</span></div>
        <div className="resumen-total"><span>Total</span><span className="resumen-total-val">${formatearPrecio(total)}</span></div>
      </aside>
    </div>
  );
}
