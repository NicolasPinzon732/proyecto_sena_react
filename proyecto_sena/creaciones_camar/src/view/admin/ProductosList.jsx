import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import HomeNavbar from '../shared/HomeNavbar';

export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroStock, setFiltroStock] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroPrecio, setFiltroPrecio] = useState('todos');
  const [pagina, setPagina] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(10);

  const categorias = [...new Set(productos.map((producto) => producto.categoria?.tipoCategoria).filter(Boolean))].sort();
  const productosFiltrados = productos.filter((producto) => {
    const stock = Number(producto.stockTotal || 0);
    const precio = Number(producto.precio || 0);
    const coincideStock = filtroStock === 'agotados'
      ? stock === 0
      : filtroStock === 'bajo'
        ? stock > 0 && stock <= 5
        : filtroStock === 'disponibles'
          ? stock > 0
          : true;
    const coincideCategoria = !filtroCategoria || producto.categoria?.tipoCategoria === filtroCategoria;
    const coincidePrecio = filtroPrecio === 'economico'
      ? precio < 100000
      : filtroPrecio === 'medio'
        ? precio >= 100000 && precio <= 200000
        : filtroPrecio === 'alto'
          ? precio > 200000
          : true;
    return coincideStock && coincideCategoria && coincidePrecio;
  });
  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / productosPorPagina));
  const productosVisibles = productosFiltrados.slice(
    (pagina - 1) * productosPorPagina,
    pagina * productosPorPagina,
  );

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
        setPagina(1);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    const timer = setTimeout(fetchProductos, 300);
    return () => clearTimeout(timer);
  }, [busqueda]);

  useEffect(() => {
    if (pagina > totalPaginas) setPagina(totalPaginas);
  }, [pagina, totalPaginas]);

  const cambiarCantidad = (event) => {
    setProductosPorPagina(Number(event.target.value));
    setPagina(1);
  };

  const actualizarFiltro = (actualizador) => (event) => {
    actualizador(event.target.value);
    setPagina(1);
  };

  const descargarReporte = () => {
    const documento = new jsPDF({ orientation: 'landscape' });
    const filas = productosFiltrados.map((producto) => [
      producto.id,
      producto.nombre,
      producto.categoria?.tipoCategoria || 'Sin categoría',
      `$${Number(producto.precio || 0).toLocaleString('es-CO')}`,
      `${Number(producto.stockTotal || 0)} unidades`,
      Number(producto.stockTotal || 0) === 0 ? 'Agotado' : 'Disponible',
    ]);
    documento.setFontSize(18);
    documento.setTextColor(48, 71, 37);
    documento.text('Reporte de productos', 14, 16);
    documento.setFontSize(9);
    documento.setTextColor(100, 110, 99);
    documento.text(`Generado: ${new Date().toLocaleString('es-CO')} | Productos: ${filas.length}`, 14, 23);
    autoTable(documento, {
      startY: 30,
      head: [['ID', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Estado']],
      body: filas,
      theme: 'grid',
      headStyles: { fillColor: [80, 109, 47], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 242] },
      styles: { fontSize: 9, cellPadding: 3 },
    });
    documento.save('reporte-productos.pdf');
  };

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
        <div className="admin-list-header__actions">
          <button type="button" className="admin-report-button" onClick={descargarReporte} disabled={!productosFiltrados.length}>
            <i className="bi bi-file-earmark-pdf me-1"></i> Reporte PDF
          </button>
          <a href="/admin/productos/crear" className="admin-primary-button">
            <i className="bi bi-plus-circle me-1"></i> Nuevo producto
          </a>
        </div>
      </div>

      <div className="card card-custom admin-filter-card p-3 mb-4">
        <div className="input-group mb-3">
          <span className="input-group-text"><i className="bi bi-search"></i></span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar productos por nombre..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
          />
        </div>
        <div className="admin-report-filters">
          <select value={filtroStock} onChange={actualizarFiltro(setFiltroStock)} aria-label="Filtrar por stock">
            <option value="todos">Todo el stock</option>
            <option value="disponibles">Con stock</option>
            <option value="bajo">Stock bajo (1 a 5)</option>
            <option value="agotados">Agotados</option>
          </select>
          <select value={filtroCategoria} onChange={actualizarFiltro(setFiltroCategoria)} aria-label="Filtrar por categoría">
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
          </select>
          <select value={filtroPrecio} onChange={actualizarFiltro(setFiltroPrecio)} aria-label="Filtrar por precio">
            <option value="todos">Todos los precios</option>
            <option value="economico">Menos de $100.000</option>
            <option value="medio">$100.000 a $200.000</option>
            <option value="alto">Más de $200.000</option>
          </select>
        </div>
      </div>

      {productosFiltrados.length > 0 && (
        <div className="admin-pagination-bar">
          <label htmlFor="productos-por-pagina">Mostrar</label>
          <select className="admin-pagination-select" id="productos-por-pagina" value={productosPorPagina} onChange={cambiarCantidad}>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span>productos</span>
          <div className="admin-pagination-controls">
            <button type="button" onClick={() => setPagina((actual) => actual - 1)} disabled={pagina === 1} aria-label="Página anterior">
              <i className="bi bi-chevron-left"></i>
            </button>
            <span>Página {pagina} de {totalPaginas}</span>
            <button type="button" onClick={() => setPagina((actual) => actual + 1)} disabled={pagina === totalPaginas} aria-label="Página siguiente">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      <div className="row g-4 admin-product-grid">
        {productosVisibles.map((producto) => (
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

      {productosFiltrados.length === 0 && (
        <div className="card card-custom p-4 text-center text-muted">
          <i className="bi bi-box fs-2 d-block mb-2"></i>
          <p>{productos.length ? 'No hay productos que coincidan con los filtros.' : 'No hay productos registrados aún.'}</p>
        </div>
      )}
      </div>
    </>
  );
}
