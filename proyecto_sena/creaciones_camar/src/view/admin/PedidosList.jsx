import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PedidosList() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const url = filtroEstado
          ? `http://localhost:8080/api/pedidos/estado/${filtroEstado}`
          : 'http://localhost:8080/api/pedidos';
        const response = await fetch(url);
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [filtroEstado]);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await fetch(`http://localhost:8080/api/pedidos/${id}/estado/${nuevoEstado}`, {
        method: 'PUT',
      });
      setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><p>Cargando...</p></div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0">Pedidos</h4>
          <p className="text-muted small mb-0">Gestiona todos los pedidos de clientes</p>
        </div>
      </div>

      <div className="card card-custom p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md">
            <select
              className="form-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card card-custom p-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td><strong>#{pedido.id}</strong></td>
                  <td>{pedido.usuario?.nombres} {pedido.usuario?.apellidos}</td>
                  <td>${pedido.total?.toLocaleString()}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={pedido.estado}
                      onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td>
                    <small>{new Date(pedido.fechaPedido).toLocaleDateString('es-ES')}</small>
                  </td>
                  <td>
                    <a href={`/admin/pedidos/${pedido.id}`} className="btn btn-sm btn-outline-info">
                      <i className="bi bi-eye"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pedidos.length === 0 && (
          <div className="text-center text-muted py-5">
            <i className="bi bi-bag fs-2 d-block mb-2"></i>
            <p>No hay pedidos registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
