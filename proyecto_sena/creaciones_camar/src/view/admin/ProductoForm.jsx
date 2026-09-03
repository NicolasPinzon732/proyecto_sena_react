import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import HomeNavbar from '../shared/HomeNavbar';

function obtenerTallas(valor, stockTotal) {
  try {
    const tallas = JSON.parse(valor || '[]');
    if (Array.isArray(tallas) && tallas.length) return tallas;
  } catch {
    // Convierte el formato antiguo de tallas separadas por comas.
  }

  const nombres = String(valor || '').split(',').map((talla) => talla.trim()).filter(Boolean);
  const stock = Number(stockTotal || 0);
  const base = nombres.length ? Math.floor(stock / nombres.length) : 0;
  const sobrante = nombres.length ? stock % nombres.length : 0;
  return nombres.map((talla, index) => ({ talla, cantidad: base + (index < sobrante ? 1 : 0) }));
}

export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    descripcionCorta: '',
    precio: '',
    stockTotal: '',
    imagen: '',
    categoria: { id: '' },
    tallas: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(id ? true : false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch('http://localhost:8080/api/categorias/activas');
        const categoriasList = await catRes.json();
        setCategorias(categoriasList);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    const fetchProducto = async () => {
      if (id) {
        try {
          const response = await fetch(`http://localhost:8080/api/productos/${id}`);
          const data = await response.json();
          setFormData(data);
        } catch (error) {
          console.error('Error al cargar producto:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const actualizarTalla = (indice, campo, valor) => {
    const tallas = obtenerTallas(formData.tallas, formData.stockTotal).map((talla, index) => (
      index === indice ? { ...talla, [campo]: campo === 'cantidad' ? Math.max(0, Number(valor || 0)) : valor } : talla
    ));
    setFormData((prev) => ({
      ...prev,
      tallas: JSON.stringify(tallas),
      stockTotal: tallas.reduce((total, talla) => total + Number(talla.cantidad || 0), 0),
    }));
  };

  const agregarTalla = () => {
    const tallas = [...obtenerTallas(formData.tallas, formData.stockTotal), { talla: '', cantidad: 0 }];
    setFormData((prev) => ({ ...prev, tallas: JSON.stringify(tallas) }));
  };

  const eliminarTalla = (indice) => {
    const tallas = obtenerTallas(formData.tallas, formData.stockTotal).filter((_, index) => index !== indice);
    setFormData((prev) => ({
      ...prev,
      tallas: JSON.stringify(tallas),
      stockTotal: tallas.reduce((total, talla) => total + Number(talla.cantidad || 0), 0),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id
        ? `http://localhost:8080/api/productos/${id}`
        : 'http://localhost:8080/api/productos';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/admin/productos');
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><p>Cargando...</p></div>;
  }

  return (
    <>
      <HomeNavbar role="admin" />
      <div className="dashboard-shell admin-form-shell">
      <div className="dashboard-header admin-list-header admin-form-header">
        <div>
          <p className="dashboard-kicker">Panel administrativo · Productos</p>
          <h1>{id ? 'Editar producto' : 'Crear producto'}</h1>
          <p className="text-muted small mb-0">Completa la información del producto</p>
        </div>
        <a href="/admin/productos" className="admin-secondary-button">
          <i className="bi bi-arrow-left me-1"></i> Volver
        </a>
      </div>

      <div className="card card-custom admin-form-card">
        <div className="admin-form-card__intro">
          <div className="admin-form-card__icon"><i className="bi bi-box-seam-fill"></i></div>
          <div>
            <h2>Datos del producto</h2>
            <p>Administra la información que aparecerá en el catálogo.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Categoría</label>
              <select
                name="categoria"
                className="form-select"
                value={formData.categoria?.id || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  categoria: { id: e.target.value }
                }))}
                required
              >
                <option value="">Selecciona categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.tipoCategoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Precio (COP)</label>
              <input
                type="number"
                name="precio"
                className="form-control"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Stock total calculado</label>
              <input
                type="number"
                name="stockTotal"
                className="form-control"
                value={formData.stockTotal}
                readOnly
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Descripción corta</label>
              <input
                type="text"
                name="descripcionCorta"
                className="form-control"
                value={formData.descripcionCorta}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                className="form-control"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>

            <div className="col-12">
              <div className="admin-size-heading">
                <label className="form-label mb-0">Stock por talla</label>
                <button type="button" className="admin-size-add" onClick={agregarTalla}>
                  <i className="bi bi-plus-circle me-1"></i>Agregar talla
                </button>
              </div>
              <div className="admin-size-grid">
                {obtenerTallas(formData.tallas, formData.stockTotal).map((talla, index) => (
                  <div className="admin-size-row" key={`${talla.talla}-${index}`}>
                    <input type="text" className="form-control" value={talla.talla} onChange={(e) => actualizarTalla(index, 'talla', e.target.value)} placeholder="Talla" required />
                    <input type="number" className="form-control" value={talla.cantidad} onChange={(e) => actualizarTalla(index, 'cantidad', e.target.value)} min="0" placeholder="Unidades" required />
                    <button type="button" className="admin-size-remove" onClick={() => eliminarTalla(index)} aria-label={`Eliminar talla ${talla.talla || index + 1}`}><i className="bi bi-trash"></i></button>
                  </div>
                ))}
              </div>
              {!obtenerTallas(formData.tallas, formData.stockTotal).length && <p className="admin-form-empty">Agrega al menos una talla para definir su stock.</p>}
              <small className="admin-form-help">Cada talla tiene su propio inventario.</small>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Imagen URL</label>
              <input
                type="text"
                name="imagen"
                className="form-control"
                value={formData.imagen}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <a href="/admin/productos" className="admin-secondary-button">
              Cancelar
            </a>
            <button type="submit" className="admin-primary-button">
              Guardar
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
}
