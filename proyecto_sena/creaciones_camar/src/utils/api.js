const API_URL = 'http://localhost:8080';

const API_ID_REGEX = /^\d+$/;

export function validarIdApi(id) {
  const idTexto = String(id ?? '');
  if (!API_ID_REGEX.test(idTexto)) {
    throw new Error('El identificador recibido no es válido.');
  }
  return encodeURIComponent(idTexto);
}

export function validarOpcionApi(valor, opciones) {
  if (!opciones.includes(valor)) {
    throw new Error('La opción recibida no es válida.');
  }
  return encodeURIComponent(valor);
}

function obtenerToken() {
  try {
    const usuario = JSON.parse(localStorage.getItem('user') || localStorage.getItem('usuario') || 'null');
    return usuario?.token || localStorage.getItem('token');
  } catch {
    return localStorage.getItem('token');
  }
}

export async function apiFetch(ruta, opciones = {}) {
  const token = obtenerToken();

  if (!ruta.startsWith('/') || ruta.startsWith('//') || ruta.includes('://')) {
    throw new Error('La ruta de la API no es válida.');
  }

  const respuesta = await fetch(new URL(ruta, API_URL), {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opciones.headers || {}),
    },
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(data.message || 'Ocurrió un error al comunicarse con el servidor.');
  }

  return data;
}

export { API_URL };
