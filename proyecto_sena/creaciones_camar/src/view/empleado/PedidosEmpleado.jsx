import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeNavbar from '../shared/HomeNavbar';

export default function PedidosEmpleado() {
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [errorEstado, setErrorEstado] = useState('');

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
      }
    };

    fetchPedidos();
  }, [filtroEstado]);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      setErrorEstado('');
      const response = await fetch(`http://localhost:8080/api/pedidos/${id}/estado/${nuevoEstado}`, {
        method: 'PUT',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'No se pudo actualizar el estado.');
      setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setErrorEstado(error.message || 'No se pudo actualizar el estado.');
    }
  };

  return (
    <>
      <HomeNavbar role="empleado" />
      <div className="dashboard-shell admin-list-shell empleado-pedidos-shell">
      <div className="dashboard-header admin-list-header empleado-pedidos-header">
        <div>
          <p className="dashboard-kicker">Panel operativo · Empleado</p>
          <h1>Gestión de pedidos</h1>
          <p className="text-muted small mb-0">Confirma y registra el estado de los pedidos</p>
        </div>
      </div>

      <div className="card card-custom admin-filter-card empleado-filter-card p-3 mb-4">
        {errorEstado && <div className="alert alert-danger mb-3">{errorEstado}</div>}
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <select
              className="form-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los pedidos</option>
              <option value="pendiente">Pedidos Pendientes</option>
              <option value="confirmado">Pedidos Confirmados</option>
              <option value="enviado">Pedidos Enviados</option>
              <option value="entregado">Pedidos Entregados</option>
              <option value="cancelado">Pedidos Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row g-4 empleado-pedidos-grid">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="col-12 col-md-6">
            <div className="card empleado-pedido-card">
              <div className="empleado-pedido-card__header">
                <div>
                  <p className="empleado-pedido-card__eyebrow">Pedido</p>
                  <strong>#{pedido.id}</strong>
                </div>
                <span className="empleado-pedido-card__date">
                  {new Date(pedido.fechaPedido).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="card-body empleado-pedido-card__body">
                <div className="empleado-pedido-status">{pedido.estado}</div>
                <div className="empleado-pedido-data">
                  <p><span>Cliente</span><strong>{pedido.usuario?.nombres} {pedido.usuario?.apellidos}</strong></p>
                  <p><span>Email</span><strong>{pedido.usuario?.email || 'No registrado'}</strong></p>
                  <p><span>Teléfono</span><strong>{pedido.usuario?.telefono || 'No registrado'}</strong></p>
                  <p><span>Entrega</span><strong>{pedido.direccion}, {pedido.ciudad}, {pedido.pais}</strong></p>
                  <p><span>Total</span><strong className="empleado-pedido-total">${Number(pedido.total || 0).toLocaleString('es-CO')}</strong></p>
                </div>

                <div className="empleado-pedido-actions">
                  <span>Actualizar estado</span>
                  <div>
                    <button
                      type="button"
                      className={`empleado-status-button ${pedido.estado === 'pendiente' ? 'active pending' : ''}`}
                      onClick={() => cambiarEstado(pedido.id, 'pendiente')}
                    >
                      Pendiente
                    </button>
                    <button
                      type="button"
                      className={`empleado-status-button ${pedido.estado === 'confirmado' ? 'active confirmed' : ''}`}
                      onClick={() => cambiarEstado(pedido.id, 'confirmado')}
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      className={`empleado-status-button ${pedido.estado === 'enviado' ? 'active shipped' : ''}`}
                      onClick={() => cambiarEstado(pedido.id, 'enviado')}
                    >
                      Enviar
                    </button>
                    <button
                      type="button"
                      className={`empleado-status-button ${pedido.estado === 'entregado' ? 'active delivered' : ''}`}
                      onClick={() => cambiarEstado(pedido.id, 'entregado')}
                    >
                      Entregado
                    </button>
                    <button
                      type="button"
                      className={`empleado-status-button ${pedido.estado === 'cancelado' ? 'active cancelled' : ''}`}
                      onClick={() => cambiarEstado(pedido.id, 'cancelado')}
                    >
                      Cancelado
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pedidos.length === 0 && (
        <div className="admin-empty-state text-center text-muted py-5">
          <i className="bi bi-bag fs-2 d-block mb-2"></i>
          <p>No hay pedidos en este estado.</p>
        </div>
      )}
      </div>
    </>
  );
}
