const CLAVE = 'carrito';

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) || '[]');
  } catch {
    return [];
  }
}

function guardarCarrito(items) {
  localStorage.setItem(CLAVE, JSON.stringify(items));
  window.dispatchEvent(new Event('carrito-actualizado'));
}

export function obtenerCarrito() {
  return leerCarrito();
}

export function obtenerCantidadCarrito() {
  return leerCarrito().reduce((total, item) => total + Number(item.cantidad || 0), 0);
}

export function agregarAlCarrito(producto, talla, cantidad = 1) {
  const items = leerCarrito();
  const key = `${producto.id}-${talla}`;
  const existente = items.find((item) => item.key === key);

  if (existente) {
    existente.cantidad += Number(cantidad || 1);
  } else {
    items.push({ key, talla, cantidad: Number(cantidad || 1), producto });
  }

  guardarCarrito(items);
}

export function actualizarCantidad(key, cantidad) {
  const items = leerCarrito().map((item) =>
    item.key === key ? { ...item, cantidad: Math.max(1, Number(cantidad || 1)) } : item
  );
  guardarCarrito(items);
}

export function eliminarDelCarrito(key) {
  const items = leerCarrito().filter((item) => item.key !== key);
  guardarCarrito(items);
}

export function vaciarCarrito() {
  guardarCarrito([]);
}
