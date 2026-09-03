import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeNavbar from '../shared/HomeNavbar';

export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

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
            <div className="card card-custom admin-product-card p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="mb-0 fw-bold">{producto.nombre}</h6>
                  <small className="text-muted">{producto.categoria?.tipoCategoria}</small>
                </div>
                <div className="d-flex gap-2">
                  <a
                    href={`/admin/productos/${producto.id}/editar`}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    <i className="bi bi-pencil"></i>
                  </a>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleEliminar(producto.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <p className="text-muted small mb-1">{producto.descripcionCorta}</p>
              <p className="fw-semibold mb-2">${producto.precio.toLocaleString()}</p>

              <p className="small mb-1"><strong>Stock total</strong></p>
              <span className={`badge ${producto.stockTotal > 10 ? 'bg-success' : 'bg-warning text-dark'}`}>
                {producto.stockTotal} unidades
              </span>
            </div>
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
