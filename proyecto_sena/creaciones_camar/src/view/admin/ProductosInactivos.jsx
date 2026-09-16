import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeNavbar from '../shared/HomeNavbar';

function formatearImagen(imagen) {
  if (!imagen) return '';
  if (imagen.startsWith('http')) return imagen;
  return `http://localhost:8080${imagen.startsWith('/') ? imagen : `/${imagen}`}`;
}

export default function ProductosInactivos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarProductosInactivos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos/inactivos');
        if (!response.ok) throw new Error('No se pudieron cargar los productos inactivos.');
        setProductos(await response.json());
      } catch (errorCarga) {
        setError(errorCarga.message || 'No se pudieron cargar los productos inactivos.');
      } finally {
        setCargando(false);
      }
    };

    cargarProductosInactivos();
  }, []);

  const activarProducto = async (producto) => {
    setError('');
    try {
      const response = await fetch(`http://localhost:8080/api/productos/${producto.id}/activar`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('No se pudo activar el producto.');
      setProductos((productosActuales) => productosActuales.filter((item) => item.id !== producto.id));
    } catch (errorActivacion) {
      setError(errorActivacion.message || 'No se pudo activar el producto.');
    }
  };

  return (
    <>
      <HomeNavbar role="admin" />
      <div className="dashboard-shell admin-list-shell">
        <div className="dashboard-header admin-list-header">
          <div>
            <p className="dashboard-kicker">Panel administrativo</p>
            <h1>Productos inactivos</h1>
            <p className="text-muted small mb-0">Revisa y reactiva productos que no aparecen en el catálogo.</p>
          </div>
          <a href="/admin/productos" className="admin-secondary-button">
            <i className="bi bi-arrow-left me-1"></i> Volver a productos
          </a>
        </div>

        {error && (
          <div className="app-validation-alert alert alert-danger mb-4" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {cargando ? (
          <div className="card card-custom admin-inactive-empty">Cargando productos inactivos...</div>
        ) : productos.length === 0 ? (
          <div className="card card-custom admin-inactive-empty">
            <i className="bi bi-box-seam"></i>
            <strong>No hay productos inactivos</strong>
            <span>Todos los productos están disponibles en el catálogo.</span>
          </div>
        ) : (
          <div className="row g-4 admin-product-grid">
            {productos.map((producto) => (
              <div key={producto.id} className="col-12 col-md-6">
                <article className="admin-product-card admin-product-card--inactive">
                  <div className="admin-product-card__visual">
                    {producto.imagen ? (
                      <img src={formatearImagen(producto.imagen)} alt={producto.nombre} />
                    ) : (
                      <i className="bi bi-image" aria-hidden="true"></i>
                    )}
                    <span className="admin-product-card__category">Inactivo</span>
                  </div>
                  <div className="admin-product-card__body">
                    <div className="admin-product-card__heading">
                      <div>
                        <h2>{producto.nombre}</h2>
                        <p>{producto.descripcionCorta || 'Producto sin descripción corta.'}</p>
                      </div>
                      <strong>${Number(producto.precio || 0).toLocaleString('es-CO')}</strong>
                    </div>
                    <div className="admin-product-card__inventory">
                      <span><i className="bi bi-box-seam"></i> Inventario</span>
                      <b>{producto.stockTotal || 0} unidades</b>
                    </div>
                    <button type="button" className="admin-activate-button" onClick={() => activarProducto(producto)}>
                      <i className="bi bi-check-circle-fill me-1"></i> Activar producto
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
