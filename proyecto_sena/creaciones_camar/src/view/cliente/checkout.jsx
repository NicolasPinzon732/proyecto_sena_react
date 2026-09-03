import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/style_cliente.css";
import { apiFetch } from "../../utils/api";
import { obtenerCarrito, vaciarCarrito } from "../../utils/cart";

const COSTO_ENVIO = 12000;

const PAISES = {
  Argentina: { moneda: "ARS", locale: "es-AR", tasaCop: 0.29, ciudades: ["Buenos Aires", "Córdoba", "Rosario"] },
  Bolivia: { moneda: "BOB", locale: "es-BO", tasaCop: 0.0025, ciudades: ["La Paz", "Santa Cruz de la Sierra", "Cochabamba"] },
  Brasil: { moneda: "BRL", locale: "pt-BR", tasaCop: 0.0013, ciudades: ["São Paulo", "Río de Janeiro", "Brasilia"] },
  Chile: { moneda: "CLP", locale: "es-CL", tasaCop: 0.23, ciudades: ["Santiago", "Valparaíso", "Concepción"] },
  Colombia: { moneda: "COP", locale: "es-CO", tasaCop: 1, ciudades: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga"] },
  Ecuador: { moneda: "USD", locale: "es-EC", tasaCop: 0.00025, ciudades: ["Quito", "Guayaquil", "Cuenca"] },
  Paraguay: { moneda: "PYG", locale: "es-PY", tasaCop: 1.85, ciudades: ["Asunción", "Ciudad del Este", "Encarnación"] },
  Perú: { moneda: "PEN", locale: "es-PE", tasaCop: 0.00094, ciudades: ["Lima", "Arequipa", "Trujillo"] },
  Uruguay: { moneda: "UYU", locale: "es-UY", tasaCop: 0.010, ciudades: ["Montevideo", "Salto", "Ciudad de la Costa"] },
  México: { moneda: "MXN", locale: "es-MX", tasaCop: 0.0043, ciudades: ["Ciudad de México", "Guadalajara", "Monterrey"] },
};

function formatearPrecio(precio, pais) {
  const configuracion = PAISES[pais];
  const valor = precio * configuracion.tasaCop;
  return new Intl.NumberFormat(configuracion.locale, {
    style: "currency",
    currency: configuracion.moneda,
    maximumFractionDigits: configuracion.moneda === "COP" || configuracion.moneda === "CLP" || configuracion.moneda === "PYG" ? 0 : 2,
  }).format(valor);
}

export default function Checkout() {
  const navigate = useNavigate();
  const [items] = useState(() => obtenerCarrito());
  const [form, setForm] = useState({
    pais: "Colombia",
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
  const configuracionPais = PAISES[form.pais];

  function actualizarCampo(valor, campo) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
      ...(campo === "pais" ? { ciudad: "" } : {}),
    }));
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
          pais: form.pais,
          ciudad: form.ciudad,
          direccion: form.direccion,
          codigoPostal: form.codigo_postal,
          metodoPagoNombre: form.metodo_pago,
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

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold" htmlFor="pais">País</label>
              <select
                id="pais"
                className="form-select"
                value={form.pais}
                onChange={(e) => actualizarCampo(e.target.value, "pais")}
                required
              >
                {Object.entries(PAISES).map(([pais, datos]) => (
                  <option key={pais} value={pais}>{pais} ({datos.moneda})</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold" htmlFor="ciudad">Ciudad</label>
              <select
                id="ciudad"
                className="form-select"
                value={form.ciudad}
                onChange={(e) => actualizarCampo(e.target.value, "ciudad")}
                required
              >
                <option value="">Selecciona una ciudad</option>
                {configuracionPais.ciudades.map((ciudad) => <option key={ciudad} value={ciudad}>{ciudad}</option>)}
              </select>
            </div>
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
        <p className="resumen-title">Información del pedido</p>
        <div className="checkout-shipping-info">
          <p>Información del envío</p>
          <div><span>País</span><strong>{form.pais}</strong></div>
          <div><span>Moneda</span><strong>{configuracionPais.moneda}</strong></div>
          <div><span>Ciudad</span><strong>{form.ciudad || "Pendiente"}</strong></div>
        </div>
        {items.map((item) => (
          <div key={item.key} className="resumen-row" style={{ marginBottom: "10px" }}>
            <span>
              {item.producto?.nombre} <small>x{item.cantidad}</small>
            </span>
            <span>{formatearPrecio(Number(item.producto?.precio || 0) * Number(item.cantidad || 0), form.pais)}</span>
          </div>
        ))}
        <div className="resumen-row"><span>Subtotal</span><span>{formatearPrecio(subtotal, form.pais)}</span></div>
        <div className="resumen-row"><span>Costo del envío</span><span>{formatearPrecio(COSTO_ENVIO, form.pais)}</span></div>
        <div className="resumen-total"><span>Total</span><span className="resumen-total-val">{formatearPrecio(total, form.pais)}</span></div>
      </aside>
    </div>
  );
}
