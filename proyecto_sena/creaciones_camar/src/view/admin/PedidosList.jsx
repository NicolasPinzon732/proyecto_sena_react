import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../shared/HomeNavbar';

const ESTADOS_PEDIDO = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function PedidosList() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [errorEstado, setErrorEstado] = useState('');

  const formatearTotal = (total) => `$${Number(total || 0).toLocaleString('es-CO')}`;
  const formatearFecha = (fecha) => fecha
    ? new Date(fecha).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
    : 'Sin fecha';

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
      if (!response.ok) throw new Error(data.message || 'No se pudo cambiar el estado del pedido.');
      setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setErrorEstado(error.message || 'No se pudo cambiar el estado del pedido.');
    }
  };

  return (
    <>
      <HomeNavbar role="admin" />
      <div className="dashboard-shell admin-list-shell pedidos-admin-shell">
        <div className="dashboard-header pedidos-admin-header">
          <div>
            <p className="dashboard-kicker">Panel operativo · Administración</p>
            <h1>Gestión de pedidos</h1>
            <p className="text-muted small mb-0">Confirma y registra el estado de los pedidos</p>
          </div>
          <button type="button" className="admin-secondary-button pedidos-admin-exit" onClick={() => navigate('/admin')}>
            <i className="bi bi-arrow-left me-2"></i>Salir
          </button>
        </div>

      <div className="card card-custom p-3 mb-4 pedidos-admin-filter">
        {errorEstado && <div className="alert alert-danger mb-3">{errorEstado}</div>}
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md">
            <select
              className="form-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
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
        {pedidos.map((pedido) => {
          const estado = String(pedido.estado || 'pendiente').toLowerCase();
          const cliente = `${pedido.usuario?.nombres || ''} ${pedido.usuario?.apellidos || ''}`.trim() || 'Sin cliente';
          const entrega = `${pedido.direccion || 'Sin dirección'}, ${pedido.ciudad || 'Sin ciudad'}, ${pedido.pais || 'Sin país'}`;

          return (
            <div key={pedido.id} className="col-12 col-md-6">
              <div className="card empleado-pedido-card">
                <div className="empleado-pedido-card__header">
                <div>
                  <p className="empleado-pedido-card__eyebrow">Pedido</p>
                  <strong>#{pedido.id}</strong>
                </div>
                <span className="empleado-pedido-card__date">{new Date(pedido.fechaPedido).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="card-body empleado-pedido-card__body">
                <div className={`empleado-pedido-status empleado-pedido-status--${estado}`}>{ESTADOS_PEDIDO[estado] || estado}</div>
                <div className="empleado-pedido-data">
                  <p><span>Cliente</span><strong>{cliente}</strong></p>
                  <p><span>Email</span><strong>{pedido.usuario?.email || 'No registrado'}</strong></p>
                  <p><span>Teléfono</span><strong>{pedido.usuario?.telefono || 'No registrado'}</strong></p>
                  <p><span>Entrega</span><strong>{entrega}</strong></p>
                  <p><span>Total</span><strong className="empleado-pedido-total">{formatearTotal(pedido.total)}</strong></p>
                </div>

                <div className="empleado-pedido-actions">
                  <span>Actualizar estado</span>
                  <div>
                    {['confirmado', 'enviado', 'entregado'].map((estadoSiguiente) => (
                      <button
                        key={estadoSiguiente}
                        type="button"
                        className={`empleado-status-button ${estado === estadoSiguiente ? `active ${estadoSiguiente === 'confirmado' ? 'confirmed' : estadoSiguiente === 'enviado' ? 'shipped' : 'delivered'}` : ''}`}
                        onClick={() => cambiarEstado(pedido.id, estadoSiguiente)}
                      >
                        {ESTADOS_PEDIDO[estadoSiguiente]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </div>
          );
        })}
        {pedidos.length === 0 && (
          <div className="admin-order-empty text-center text-muted py-5">
            <i className="bi bi-bag fs-2 d-block mb-2"></i>
            <p>No hay pedidos registrados.</p>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
