import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeNavbar from '../shared/HomeNavbar';

export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const formatearImagen = (imagen) => {
    if (!imagen) return '';
    if (imagen.startsWith('http')) return imagen;
    return `http://localhost:8080${imagen.startsWith('/') ? imagen : `/${imagen}`}`;
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const url = busqueda
          ? `http://localhost:8080/api/productos/buscar?nombre=${busqueda}`
          : 'http://localhost:8080/api/productos/activos';
        const response = await fetch(url);
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    const timer = setTimeout(fetchProductos, 300);
    return () => clearTimeout(timer);
  }, [busqueda]);

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await fetch(`http://localhost:8080/api/productos/${id}`, { method: 'DELETE' });
        setProductos(productos.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  return (
    <>
      <HomeNavbar role="admin" />
      <div className="dashboard-shell admin-list-shell">
      <div className="dashboard-header admin-list-header">
        <div>
          <p className="dashboard-kicker">Panel administrativo</p>
          <h1>Productos</h1>
          <p className="text-muted small mb-0">Gestiona el catálogo de productos</p>
        </div>
        <a href="/admin/productos/crear" className="admin-primary-button">
          <i className="bi bi-plus-circle me-1"></i> Nuevo producto
        </a>
      </div>

      <div className="card card-custom admin-filter-card p-3 mb-4">
        <div className="input-group">
          <span className="input-group-text"><i className="bi bi-search"></i></span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar productos por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-4 admin-product-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="col-12 col-md-6">
            <article className="admin-product-card">
              <div className="admin-product-card__visual">
                {producto.imagen ? (
                  <img src={formatearImagen(producto.imagen)} alt={producto.nombre} />
                ) : (
                  <i className="bi bi-image" aria-hidden="true"></i>
                )}
                <span className="admin-product-card__category">{producto.categoria?.tipoCategoria || 'Sin categoría'}</span>
                <div className="admin-product-card__actions">
                  <a
                    href={`/admin/productos/${producto.id}/editar`}
                    className="admin-product-icon-button"
                    aria-label={`Editar ${producto.nombre}`}
                  >
                    <i className="bi bi-pencil"></i>
                  </a>
                  <button
                    type="button"
                    className="admin-product-icon-button admin-product-icon-button--danger"
                    onClick={() => handleEliminar(producto.id)}
                    aria-label={`Eliminar ${producto.nombre}`}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <div className="admin-product-card__body">
                <div className="admin-product-card__heading">
                  <div>
                    <h2>{producto.nombre}</h2>
                    <p>{producto.descripcionCorta || 'Producto de la colección Creaciones Camar.'}</p>
                  </div>
                  <strong>${Number(producto.precio || 0).toLocaleString('es-CO')}</strong>
                </div>
                <div className="admin-product-card__inventory">
                  <span><i className="bi bi-box-seam"></i> Inventario</span>
                  <b className={Number(producto.stockTotal || 0) === 0 ? 'is-empty' : ''}>{producto.stockTotal || 0} unidades</b>
                </div>
                <div className="admin-product-card__bar"><span style={{ width: `${Math.min(100, Number(producto.stockTotal || 0) * 5)}%` }}></span></div>
              </div>
            </article>
          </div>
        ))}
      </div>

      {productos.length === 0 && (
        <div className="card card-custom p-4 text-center text-muted">
          <i className="bi bi-box fs-2 d-block mb-2"></i>
          <p>No hay productos registrados aún.</p>
        </div>
      )}
      </div>
    </>
  );
}
