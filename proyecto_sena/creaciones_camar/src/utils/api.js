const API_URL = 'http://localhost:8080';

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

  const respuesta = await fetch(`${API_URL}${ruta}`, {
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
