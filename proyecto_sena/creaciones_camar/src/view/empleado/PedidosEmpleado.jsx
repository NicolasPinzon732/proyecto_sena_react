import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PedidosEmpleado() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('pendiente');

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
          <h4 className="mb-0">Gestión de Pedidos</h4>
          <p className="text-muted small mb-0">Confirma y registra el estado de los pedidos</p>
        </div>
      </div>

      <div className="card card-custom p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <select
              className="form-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="pendiente">Pedidos Pendientes</option>
              <option value="confirmado">Pedidos Confirmados</option>
              <option value="enviado">Pedidos Enviados</option>
              <option value="entregado">Pedidos Entregados</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="col-12 col-md-6">
            <div className="card">
              <div className="card-header">
                <strong>Pedido #{pedido.id}</strong>
                <span className="float-end text-muted small">
                  {new Date(pedido.fechaPedido).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="card-body">
                <p className="mb-2">
                  <strong>Cliente:</strong> {pedido.usuario?.nombres} {pedido.usuario?.apellidos}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {pedido.usuario?.email}
                </p>
                <p className="mb-2">
                  <strong>Teléfono:</strong> {pedido.usuario?.telefono}
                </p>
                <p className="mb-2">
                  <strong>Dirección:</strong> {pedido.direccion}, {pedido.ciudad}, {pedido.pais}
                </p>
                <p className="mb-3">
                  <strong>Total:</strong> ${pedido.total?.toLocaleString()}
                </p>

                <div>
                  <label className="form-label small">Cambiar estado:</label>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className={`btn btn-sm ${pedido.estado === 'confirmado' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => cambiarEstado(pedido.id, 'confirmado')}
                    >
                      Confirmar
                    </button>
                    <button
                      className={`btn btn-sm ${pedido.estado === 'enviado' ? 'btn-info' : 'btn-outline-info'}`}
                      onClick={() => cambiarEstado(pedido.id, 'enviado')}
                    >
                      Enviar
                    </button>
                    <button
                      className={`btn btn-sm ${pedido.estado === 'entregado' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => cambiarEstado(pedido.id, 'entregado')}
                    >
                      Entregado
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pedidos.length === 0 && (
        <div className="text-center text-muted py-5">
          <i className="bi bi-bag fs-2 d-block mb-2"></i>
          <p>No hay pedidos en este estado.</p>
        </div>
      )}
    </div>
  );
}
