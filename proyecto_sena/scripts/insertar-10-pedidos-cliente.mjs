const API_URL = process.env.API_URL || "http://localhost:8080";
const MARCA_SEED = "[SEED-10-PEDIDOS-CLIENTE-2026]";
const COSTO_ENVIO = 12000;
const CIUDADES = ["Bogot\u00e1", "Medell\u00edn", "Cali", "Barranquilla", "Cartagena", "Bucaramanga"];
const METODOS_PAGO = ["Nequi", "Daviplata", "Transferencia Bancaria", "PayPal", "Mercado Pago"];

async function apiFetch(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: { "Content-Type": "application/json", ...(opciones.headers || {}) },
  });
  const data = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new Error(`${opciones.method || "GET"} ${ruta}: ${data.message || data.error || respuesta.statusText}`);
  }
  return data;
}

function leerTallas(producto) {
  if (!producto.tallas) return [];
  try {
    const tallas = typeof producto.tallas === "string" ? JSON.parse(producto.tallas) : producto.tallas;
    if (Array.isArray(tallas)) {
      return tallas
        .map((item) => ({ nombre: item.talla || item.nombre, stock: Number(item.cantidad || 0) }))
        .filter((item) => item.nombre && item.stock > 0);
    }
  } catch {
    return producto.tallas.split(",").map((talla) => ({ nombre: talla.trim(), stock: 1 })).filter((item) => item.nombre);
  }
  return [];
}

async function main() {
  const [usuarios, productos, pedidos] = await Promise.all([
    apiFetch("/api/usuarios/rol/cliente"),
    apiFetch("/api/productos/activos"),
    apiFetch("/api/pedidos"),
  ]);

  const existentes = pedidos.filter((pedido) => String(pedido.direccion || "").startsWith(MARCA_SEED));
  if (existentes.length >= 10) {
    console.log(`Ya existen ${existentes.length} pedidos generados por este script. No se insertaron duplicados.`);
    return;
  }

  const clientes = usuarios.filter((usuario) => usuario.activo !== false);
  const inventario = productos
    .filter((producto) => producto.activo !== false)
    .flatMap((producto) => leerTallas(producto).map((talla) => ({ producto, talla })));

  if (!clientes.length) throw new Error("No hay usuarios con rol cliente activos.");
  if (!inventario.length) throw new Error("No hay productos activos con stock disponible por talla.");

  const faltantes = 10 - existentes.length;
  let creados = 0;

  for (let indice = 0; indice < faltantes; indice += 1) {
    const opcion = inventario.find((item) => item.talla.stock > 0);
    if (!opcion) throw new Error(`El stock disponible no alcanza para crear los ${faltantes} pedidos solicitados.`);

    const cliente = clientes[indice % clientes.length];
    const ciudad = CIUDADES[indice % CIUDADES.length];
    const metodoPago = METODOS_PAGO[indice % METODOS_PAGO.length];
    const numero = existentes.length + indice + 1;
    const cantidad = 1;
    const total = Number(opcion.producto.precio) * cantidad + COSTO_ENVIO;

    await apiFetch("/api/pedidos", {
      method: "POST",
      body: JSON.stringify({
        usuario: { id: cliente.id },
        total,
        estado: "pendiente",
        pais: "Colombia",
        ciudad,
        direccion: `${MARCA_SEED} Pedido ${String(numero).padStart(2, "0")} - Calle ${10 + numero} #${20 + numero}-15`,
        codigoPostal: `11012${numero}`,
        metodoPagoNombre: metodoPago,
        detalles: [{
          producto: { id: opcion.producto.id },
          cantidad,
          precioUnitario: Number(opcion.producto.precio),
          talla: opcion.talla.nombre,
        }],
      }),
    });

    opcion.talla.stock -= cantidad;
    creados += 1;
    console.log(`Pedido ${numero}/10 creado para ${cliente.email || cliente.id}.`);
  }

  console.log(`Carga completada: ${creados} pedido(s) insertado(s) mediante POST /api/pedidos.`);
}

main().catch((error) => {
  console.error(`No se pudo completar la carga: ${error.message}`);
  process.exitCode = 1;
});
