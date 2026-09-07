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
    stockTotal: 0,
    imagen: '',
    categoria: { id: '' },
    tallas: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(id ? true : false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [nombreImagen, setNombreImagen] = useState('');

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

  const handleImagenChange = async (e) => {
    const imagen = e.target.files?.[0];
    if (!imagen) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(imagen.type)) {
      setError('Selecciona una imagen JPG, PNG, WEBP o GIF.');
      e.target.value = '';
      return;
    }
    if (imagen.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5 MB.');
      e.target.value = '';
      return;
    }

    setError('');
    setNombreImagen(imagen.name);
    setSubiendoImagen(true);
    try {
      const datos = new FormData();
      datos.append('imagen', imagen);
      const response = await fetch('http://localhost:8080/api/productos/imagenes', { method: 'POST', body: datos });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'No se pudo subir la imagen.');
      setFormData((prev) => ({ ...prev, imagen: data.url }));
    } catch (uploadError) {
      setError(uploadError.message || 'No se pudo subir la imagen.');
      setNombreImagen('');
      e.target.value = '';
    } finally {
      setSubiendoImagen(false);
    }
  };

  const obtenerVistaImagen = (imagen) => {
    if (!imagen) return '';
    return imagen.startsWith('http') ? imagen : `http://localhost:8080${imagen}`;
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
    setFormData((prev) => ({
      ...prev,
      tallas: JSON.stringify(tallas),
      stockTotal: tallas.reduce((total, talla) => total + Number(talla.cantidad || 0), 0),
    }));
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
    setError('');
    const tallas = obtenerTallas(formData.tallas, formData.stockTotal);
    const errores = [];

    if (!formData.nombre.trim()) errores.push('El nombre del producto es obligatorio.');
    if (!formData.categoria?.id) errores.push('Selecciona una categoría.');
    if (!formData.precio || Number(formData.precio) <= 0) errores.push('Ingresa un precio mayor que cero.');
    if (!tallas.length) errores.push('Agrega al menos una talla.');
    tallas.forEach((talla, index) => {
      if (!String(talla.talla || '').trim()) errores.push(`La talla ${index + 1} es obligatoria.`);
      if (Number(talla.cantidad) < 0) errores.push(`La cantidad de la talla ${index + 1} no puede ser negativa.`);
    });

    if (errores.length) {
      setError(errores[0]);
      return;
    }

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

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo guardar el producto.');
      }
      navigate('/admin/productos');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setError(error.message || 'No se pudo guardar el producto.');
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
          {error && (
            <div className="app-validation-alert alert alert-danger mb-4" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
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
                <div>
                  <label className="form-label mb-1">Inventario por talla</label>
                  <p className="admin-form-help mb-0">Unidades disponibles por talla.</p>
                </div>
                <span className="admin-size-total"><i className="bi bi-box-seam"></i>{formData.stockTotal} unidades</span>
                <button type="button" className="admin-size-add" onClick={agregarTalla}>
                  <i className="bi bi-plus-lg"></i>Añadir
                </button>
              </div>
              <div className="admin-size-grid">
                {obtenerTallas(formData.tallas, formData.stockTotal).map((talla, index) => (
                  <div className="admin-size-row" key={`${talla.talla}-${index}`}>
                    <div className="admin-size-row__top">
                      <span className="admin-size-index">Talla {String(index + 1).padStart(2, '0')}</span>
                      <button type="button" className="admin-size-remove" onClick={() => eliminarTalla(index)} aria-label={`Eliminar talla ${talla.talla || index + 1}`}><i className="bi bi-trash3"></i></button>
                    </div>
                    <label>
                      <span>Talla</span>
                      <input type="text" className="form-control" value={talla.talla} onChange={(e) => actualizarTalla(index, 'talla', e.target.value)} placeholder="Ej: M" />
                    </label>
                    <label>
                      <span>Unidades disponibles</span>
                      <input type="number" className="form-control" value={talla.cantidad} onChange={(e) => actualizarTalla(index, 'cantidad', e.target.value)} min="0" placeholder="0" />
                    </label>
                  </div>
                ))}
              </div>
              {!obtenerTallas(formData.tallas, formData.stockTotal).length && (
                <div className="admin-form-empty"><i className="bi bi-rulers"></i><span>Agrega una talla para comenzar a definir el inventario.</span></div>
              )}
            </div>

            <div className="col-12">
              <div className="producto-imagen-heading">
                <div>
                  <label className="form-label mb-1">Imagen del producto</label>
                  <p className="admin-form-help mb-0">Elige una imagen desde tu computador. Máximo 5 MB.</p>
                </div>
                {formData.imagen && <span className="producto-imagen-status"><i className="bi bi-check-circle-fill"></i> Imagen lista</span>}
              </div>
              <div className="producto-imagen-upload">
                <label className="producto-imagen-dropzone" htmlFor="imagen-producto">
                  <i className="bi bi-cloud-arrow-up"></i>
                  <strong>{subiendoImagen ? 'Subiendo imagen...' : 'Seleccionar imagen'}</strong>
                  <span>{nombreImagen || 'JPG, PNG, WEBP o GIF'}</span>
                  <input id="imagen-producto" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImagenChange} disabled={subiendoImagen} />
                </label>
                <div className="producto-imagen-preview">
                  {formData.imagen ? <img src={obtenerVistaImagen(formData.imagen)} alt="Vista previa del producto" /> : <i className="bi bi-image"></i>}
                </div>
              </div>
              <details className="producto-imagen-url">
                <summary>Usar una URL en su lugar</summary>
                <input type="text" name="imagen" className="form-control mt-2" value={formData.imagen} onChange={handleChange} placeholder="https://..." />
              </details>
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
