import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../shared/HomeNavbar';

export default function PedidosList() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');

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
      await fetch(`http://localhost:8080/api/pedidos/${id}/estado/${nuevoEstado}`, {
        method: 'PUT',
      });
      setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  return (
    <>
      <HomeNavbar role="admin" />
      <div className="dashboard-shell admin-list-shell pedidos-admin-shell">
        <div className="dashboard-header pedidos-admin-header">
          <div>
            <p className="dashboard-kicker">Panel administrativo</p>
            <h1>Pedidos</h1>
            <p className="text-muted small mb-0">Gestiona todos los pedidos de clientes</p>
          </div>
          <button type="button" className="pedidos-admin-exit" onClick={() => navigate('/admin')}>
            <i className="bi bi-arrow-left me-2"></i>Salir
          </button>
        </div>

      <div className="card card-custom p-3 mb-4 pedidos-admin-filter">
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

      <div className="card card-custom p-3 pedidos-admin-table-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Fecha del pedido</th>
                <th>Total</th>
                <th>Estado</th>
                <th>País</th>
                <th>Ciudad</th>
                <th>Dirección</th>
                <th>Código postal</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td><strong>#{pedido.id}</strong></td>
                  <td>{`${pedido.usuario?.nombres || ''} ${pedido.usuario?.apellidos || ''}`.trim() || 'Sin cliente'}</td>
                  <td><small>{formatearFecha(pedido.fechaPedido)}</small></td>
                  <td>{formatearTotal(pedido.total)}</td>
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
                  <td>{pedido.pais || 'No especificado'}</td>
                  <td>{pedido.ciudad || 'No especificada'}</td>
                  <td className="pedido-direccion">{pedido.direccion || 'No especificada'}</td>
                  <td>{pedido.codigoPostal || 'No especificado'}</td>
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
    </>
  );
}
