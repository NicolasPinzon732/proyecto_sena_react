import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/style_cliente.css";
import { apiFetch } from "../../utils/api";
import { obtenerCarrito, vaciarCarrito } from "../../utils/cart";

const COSTO_ENVIO = 12000;

const CAMPOS_PAGO = {
  Nequi: [
    { nombre: "numero", etiqueta: "Celular asociado a Nequi", tipo: "tel", placeholder: "Ej: 3001234567", ayuda: "El número desde el que realizaste el pago.", autocomplete: "tel" },
    { nombre: "titular", etiqueta: "Nombre del titular", tipo: "text", placeholder: "Nombre completo", ayuda: "Debe coincidir con el titular de la cuenta.", autocomplete: "name" },
    { nombre: "referencia", etiqueta: "Número del comprobante", tipo: "text", placeholder: "Ej: 123456", ayuda: "Copia el número que aparece en el comprobante de Nequi después de pagar." },
  ],
  Daviplata: [
    { nombre: "numero", etiqueta: "Celular asociado a Daviplata", tipo: "tel", placeholder: "Ej: 3001234567", ayuda: "El número desde el que realizaste el pago.", autocomplete: "tel" },
    { nombre: "titular", etiqueta: "Nombre del titular", tipo: "text", placeholder: "Nombre completo", ayuda: "Debe coincidir con el titular de la cuenta.", autocomplete: "name" },
    { nombre: "referencia", etiqueta: "Número del comprobante", tipo: "text", placeholder: "Ej: 123456", ayuda: "Copia el número que aparece en el comprobante de Daviplata después de pagar." },
  ],
  "Transferencia Bancaria": [
    { nombre: "banco", etiqueta: "Banco desde el que transferiste", tipo: "select", placeholder: "Selecciona tu banco", opciones: ["Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA", "Banco de Occidente", "Otro"] },
    { nombre: "titular", etiqueta: "Nombre del titular", tipo: "text", placeholder: "Nombre completo", ayuda: "Titular de la cuenta que hizo la transferencia.", autocomplete: "name" },
    { nombre: "referencia", etiqueta: "Número de comprobante bancario", tipo: "text", placeholder: "Ej: 000123456789", ayuda: "Copia el número que aparece en el recibo cuando la transferencia queda aprobada." },
  ],
  PayPal: [
    { nombre: "correo", etiqueta: "Correo de tu cuenta PayPal", tipo: "email", placeholder: "tu@email.com", ayuda: "Usa el correo de la cuenta con la que realizaste el pago.", autocomplete: "email" },
    { nombre: "referencia", etiqueta: "ID de transacción PayPal", tipo: "text", placeholder: "Ej: 8AB12345CD678901E", ayuda: "Copia el ID que aparece en el recibo enviado por PayPal." },
  ],
  "Mercado Pago": [
    { nombre: "correo", etiqueta: "Correo de tu cuenta Mercado Pago", tipo: "email", placeholder: "tu@email.com", ayuda: "El correo asociado a la cuenta que realizó el pago.", autocomplete: "email" },
    { nombre: "referencia", etiqueta: "ID de operación", tipo: "text", placeholder: "Ej: 123456789", ayuda: "Copia el ID que aparece en el comprobante de Mercado Pago." },
  ],
};

const PAISES = {
  Argentina: { moneda: "ARS", locale: "es-AR", tasaCop: 0.29, ciudades: ["Buenos Aires", "Córdoba", "Rosario"], bancos: ["Banco Nación", "BBVA Argentina", "Banco Galicia", "Santander Argentina", "Banco Macro", "Otro"] },
  Bolivia: { moneda: "BOB", locale: "es-BO", tasaCop: 0.0025, ciudades: ["La Paz", "Santa Cruz de la Sierra", "Cochabamba"], bancos: ["Banco Nacional de Bolivia", "Banco Mercantil Santa Cruz", "Banco Bisa", "Banco Unión", "Otro"] },
  Brasil: { moneda: "BRL", locale: "pt-BR", tasaCop: 0.0013, ciudades: ["São Paulo", "Río de Janeiro", "Brasilia"], bancos: ["Banco do Brasil", "Itaú Unibanco", "Bradesco", "Caixa Econômica Federal", "Santander Brasil", "Otro"] },
  Chile: { moneda: "CLP", locale: "es-CL", tasaCop: 0.23, ciudades: ["Santiago", "Valparaíso", "Concepción"], bancos: ["BancoEstado", "Banco de Chile", "Santander Chile", "BCI", "Scotiabank Chile", "Otro"] },
  Colombia: { moneda: "COP", locale: "es-CO", tasaCop: 1, ciudades: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga"], bancos: ["Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA Colombia", "Banco de Occidente", "Otro"] },
  Ecuador: { moneda: "USD", locale: "es-EC", tasaCop: 0.00025, ciudades: ["Quito", "Guayaquil", "Cuenca"], bancos: ["Banco Pichincha", "Banco Guayaquil", "Banco del Pacífico", "Produbanco", "Banco Internacional", "Otro"] },
  Paraguay: { moneda: "PYG", locale: "es-PY", tasaCop: 1.85, ciudades: ["Asunción", "Ciudad del Este", "Encarnación"], bancos: ["Banco Nacional de Fomento", "Banco Continental", "Banco Itaú Paraguay", "Banco GNB Paraguay", "Sudameris Bank", "Otro"] },
  Perú: { moneda: "PEN", locale: "es-PE", tasaCop: 0.00094, ciudades: ["Lima", "Arequipa", "Trujillo"], bancos: ["BCP", "Interbank", "BBVA Perú", "Scotiabank Perú", "BanBif", "Otro"] },
  Uruguay: { moneda: "UYU", locale: "es-UY", tasaCop: 0.010, ciudades: ["Montevideo", "Salto", "Ciudad de la Costa"], bancos: ["Banco República", "Santander Uruguay", "BBVA Uruguay", "Scotiabank Uruguay", "Itaú Uruguay", "Otro"] },
  México: { moneda: "MXN", locale: "es-MX", tasaCop: 0.0043, ciudades: ["Ciudad de México", "Guadalajara", "Monterrey"], bancos: ["BBVA México", "Banorte", "Santander México", "Citibanamex", "HSBC México", "Otro"] },
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
  const [pagoAbierto, setPagoAbierto] = useState(false);
  const [datosPago, setDatosPago] = useState({});

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

  function cambiarMetodoPago(metodo) {
    actualizarCampo(metodo, "metodo_pago");
    setDatosPago({});
  }

  function cambiarPais(pais) {
    actualizarCampo(pais, "pais");
    setDatosPago((anterior) => ({ ...anterior, banco: "" }));
  }

  function abrirFormularioPago(event) {
    event.preventDefault();
    if (!items.length) {
      setError("Tu carrito está vacío.");
      return;
    }

    const errores = [];
    if (!form.ciudad) errores.push("Selecciona una ciudad.");
    if (!form.direccion.trim()) errores.push("Ingresa una dirección.");
    if (!/^\d{7,}$/.test(form.telefono.trim())) errores.push("El teléfono debe contener al menos 7 números.");
    setError(errores.join("\n"));
    if (!errores.length) setPagoAbierto(true);
  }

  async function confirmarPedido(event) {
    event.preventDefault();
    const camposPago = CAMPOS_PAGO[form.metodo_pago] || [];
    const faltanDatos = camposPago.some((campo) => !String(datosPago[campo.nombre] || "").trim());
    if (faltanDatos) {
      setError("Completa todos los datos del método de pago.");
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
      setPagoAbierto(false);
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

        <form onSubmit={abrirFormularioPago} className="resumen-card" style={{ padding: "24px" }}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold" htmlFor="pais">País</label>
              <select
                id="pais"
                className="form-select"
                value={form.pais}
                onChange={(e) => cambiarPais(e.target.value)}
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
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Método de pago</label>
            <select
              className="form-select"
              value={form.metodo_pago}
              onChange={(e) => cambiarMetodoPago(e.target.value)}
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
              Continuar al pago
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

      {pagoAbierto && (
        <div className="checkout-payment-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPagoAbierto(false)}>
          <section className="checkout-payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
            <button type="button" className="checkout-payment-close" onClick={() => setPagoAbierto(false)} aria-label="Cerrar formulario de pago">×</button>
            <div className="checkout-payment-icon" aria-hidden="true"><i className="bi bi-shield-lock"></i></div>
            <h3 id="payment-modal-title">Completa tu pago</h3>

            <div className="checkout-payment-method">
              <span className="checkout-payment-method__icon"><i className="bi bi-credit-card-2-front"></i></span>
              <span><small>Método seleccionado</small><strong>{form.metodo_pago}</strong></span>
            </div>

            <form onSubmit={confirmarPedido} className="checkout-payment-form">
              {CAMPOS_PAGO[form.metodo_pago].map((campo) => (
                <label key={campo.nombre}>
                  <span>{campo.etiqueta}</span>
                  {campo.tipo === "select" ? (
                    <select
                      value={datosPago[campo.nombre] || ""}
                      onChange={(event) => setDatosPago((anterior) => ({ ...anterior, [campo.nombre]: event.target.value }))}
                    >
                      <option value="">{campo.placeholder}</option>
                      {(campo.nombre === "banco" ? PAISES[form.pais].bancos : campo.opciones).map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
                    </select>
                  ) : (
                    <input
                      type={campo.tipo}
                      value={datosPago[campo.nombre] || ""}
                      placeholder={campo.placeholder}
                      autoComplete={campo.autocomplete || "off"}
                      onChange={(event) => setDatosPago((anterior) => ({ ...anterior, [campo.nombre]: event.target.value }))}
                    />
                  )}
                </label>
              ))}
              <div className="checkout-payment-actions">
                <button type="button" className="checkout-payment-back" onClick={() => setPagoAbierto(false)}>Volver</button>
                <button type="submit" className="checkout-payment-confirm" disabled={guardando}>
                  <i className="bi bi-check2-circle" aria-hidden="true"></i>
                  {guardando ? "Procesando..." : "Confirmar y pagar"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
