import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style_cliente.css";
import { actualizarCantidad, eliminarDelCarrito, obtenerCarrito, vaciarCarrito } from "../../utils/cart";

const COSTO_ENVIO = 12000;

function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-CO").format(precio);
}

export default function Carrito() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const actualizarVista = () => setItems(obtenerCarrito());
    actualizarVista();
    window.addEventListener("carrito-actualizado", actualizarVista);
    return () => window.removeEventListener("carrito-actualizado", actualizarVista);
  }, []);

  const subtotal = items.reduce(
    (acum, item) => acum + Number(item.producto?.precio || 0) * Number(item.cantidad || 0),
    0
  );
  const costoEnvio = items.length > 0 ? COSTO_ENVIO : 0;

  return (
    <div className="carrito-container">
      <div>
        <h2 className="section-title">Carrito de compras</h2>

        <div className="carrito-items">
          {items.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-cart-x fs-2 d-block mb-2"></i>
              Tu carrito está vacío.
              <br />
              <Link to="/cliente/catalogo" className="btn btn-main mt-3">Ver catálogo</Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.key} className="carrito-item">
                <div className="carrito-item-img">
                  {item.producto?.imagen ? (
                    <img src={`http://localhost:8000${item.producto.imagen}`} alt={item.producto.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <i className="bi bi-image"></i>
                  )}
                </div>

                <div className="carrito-item-info">
                  <p className="carrito-item-nombre">{item.producto?.nombre}</p>
                  <p className="carrito-item-talla">Talla: {item.talla}</p>
                  <div className="carrito-item-controls">
                    <button type="button" className="ctrl-btn" onClick={() => actualizarCantidad(item.key, Number(item.cantidad) - 1)}>-</button>
                    <span className="ctrl-num">{item.cantidad}</span>
                    <button type="button" className="ctrl-btn" onClick={() => actualizarCantidad(item.key, Number(item.cantidad) + 1)}>+</button>
                  </div>
                </div>

                <span className="carrito-item-precio">${formatearPrecio(Number(item.producto?.precio || 0) * Number(item.cantidad || 0))}</span>
                <button type="button" className="btn-eliminar" title="Eliminar" onClick={() => eliminarDelCarrito(item.key)}>
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <button type="button" className="btn-vaciar" onClick={vaciarCarrito}>
            <i className="bi bi-trash3 me-2"></i>Vaciar carrito
          </button>
        )}
      </div>

      {items.length > 0 && (
        <div className="resumen-card">
          <p className="resumen-title">Resumen del pedido</p>
          <div className="resumen-row"><span>Subtotal</span><span>${formatearPrecio(subtotal)}</span></div>
          <div className="resumen-row"><span>Envío</span><span>${formatearPrecio(costoEnvio)}</span></div>
          <div className="resumen-total"><span>Total</span><span className="resumen-total-val">${formatearPrecio(subtotal + costoEnvio)}</span></div>
          <div className="resumen-actions">
            <Link to="/cliente/checkout" className="btn-pagar" style={{ display: "inline-block", textAlign: "center" }}>Proceder con el pago</Link>
            <Link to="/cliente/catalogo" className="btn-seguir">Continuar comprando</Link>
          </div>
        </div>
      )}
    </div>
  );
}