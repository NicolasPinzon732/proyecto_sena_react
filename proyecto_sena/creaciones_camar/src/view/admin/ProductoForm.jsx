import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';

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
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0">{id ? 'Editar' : 'Crear'} producto</h4>
          <p className="text-muted small mb-0">Completa la información del producto</p>
        </div>
        <a href="/admin/productos" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Volver
        </a>
      </div>

      <div className="card card-custom p-4">
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
              <label className="form-label">Stock Total</label>
              <input
                type="number"
                name="stockTotal"
                className="form-control"
                value={formData.stockTotal}
                onChange={handleChange}
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

            <div className="col-12 col-md-6">
              <label className="form-label">Tallas (separadas por comas)</label>
              <input
                type="text"
                name="tallas"
                className="form-control"
                value={formData.tallas}
                onChange={handleChange}
                placeholder="XS, S, M, L, XL"
              />
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

          <div className="d-flex justify-content-center gap-3 mt-4">
            <a href="/admin/productos" className="btn btn-outline-secondary px-4">
              Cancelar
            </a>
            <button type="submit" className="btn btn-primary px-4">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
