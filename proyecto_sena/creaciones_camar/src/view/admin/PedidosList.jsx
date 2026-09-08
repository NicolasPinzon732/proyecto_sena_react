import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroTotal, setFiltroTotal] = useState('todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [errorEstado, setErrorEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [pedidosPorPagina, setPedidosPorPagina] = useState(10);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const cliente = `${pedido.usuario?.nombres || ''} ${pedido.usuario?.apellidos || ''} ${pedido.usuario?.email || ''}`.toLowerCase();
    const total = Number(pedido.total || 0);
    const fecha = pedido.fechaPedido ? new Date(pedido.fechaPedido) : null;
    const inicio = fechaDesde ? new Date(`${fechaDesde}T00:00:00`) : null;
    const fin = fechaHasta ? new Date(`${fechaHasta}T23:59:59`) : null;
    const coincideCliente = !filtroCliente || cliente.includes(filtroCliente.toLowerCase());
    const coincideTotal = filtroTotal === 'bajo'
      ? total < 200000
      : filtroTotal === 'medio'
        ? total >= 200000 && total <= 500000
        : filtroTotal === 'alto'
          ? total > 500000
          : true;
    const coincideFecha = (!inicio || (fecha && fecha >= inicio)) && (!fin || (fecha && fecha <= fin));
    return coincideCliente && coincideTotal && coincideFecha;
  });
  const totalPaginas = Math.max(1, Math.ceil(pedidosFiltrados.length / pedidosPorPagina));
  const pedidosVisibles = pedidosFiltrados.slice(
    (pagina - 1) * pedidosPorPagina,
    pagina * pedidosPorPagina,
  );

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
        setPagina(1);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      }
    };

    fetchPedidos();
  }, [filtroEstado]);

  useEffect(() => {
    if (pagina > totalPaginas) setPagina(totalPaginas);
  }, [pagina, totalPaginas]);

  const cambiarCantidad = (event) => {
    setPedidosPorPagina(Number(event.target.value));
    setPagina(1);
  };

  const actualizarFiltro = (actualizador) => (event) => {
    actualizador(event.target.value);
    setPagina(1);
  };

  const descargarReporte = () => {
    const documento = new jsPDF({ orientation: 'landscape' });
    const filas = pedidosFiltrados.map((pedido) => [
      pedido.id,
      `${pedido.usuario?.nombres || ''} ${pedido.usuario?.apellidos || ''}`.trim() || 'Sin cliente',
      pedido.usuario?.email || 'No registrado',
      ESTADOS_PEDIDO[String(pedido.estado || 'pendiente').toLowerCase()] || pedido.estado || 'Pendiente',
      pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleDateString('es-CO') : 'Sin fecha',
      pedido.ciudad || 'Sin ciudad',
      `$${Number(pedido.total || 0).toLocaleString('es-CO')}`,
    ]);
    documento.setFontSize(18);
    documento.setTextColor(48, 71, 37);
    documento.text('Reporte de pedidos', 14, 16);
    documento.setFontSize(9);
    documento.setTextColor(100, 110, 99);
    documento.text(`Generado: ${new Date().toLocaleString('es-CO')} | Pedidos: ${filas.length}`, 14, 23);
    autoTable(documento, {
      startY: 30,
      head: [['ID', 'Cliente', 'Email', 'Estado', 'Fecha', 'Ciudad', 'Total']],
      body: filas,
      theme: 'grid',
      headStyles: { fillColor: [80, 109, 47], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 242] },
      styles: { fontSize: 8, cellPadding: 3 },
    });
    documento.save('reporte-pedidos.pdf');
  };

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
          <div className="admin-list-header__actions">
            <button type="button" className="admin-report-button" onClick={descargarReporte} disabled={!pedidosFiltrados.length}>
              <i className="bi bi-file-earmark-pdf me-1"></i> Reporte PDF
            </button>
            <button type="button" className="admin-secondary-button pedidos-admin-exit" onClick={() => navigate('/admin')}>
              <i className="bi bi-arrow-left me-2"></i>Salir
            </button>
          </div>
        </div>

      <div className="card card-custom p-3 mb-4 pedidos-admin-filter">
        {errorEstado && <div className="alert alert-danger mb-3">{errorEstado}</div>}
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md">
            <select
              className="form-select"
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setPagina(1);
              }}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pedidos Pendientes</option>
              <option value="confirmado">Pedidos Confirmados</option>
              <option value="enviado">Pedidos Enviados</option>
              <option value="entregado">Pedidos Entregados</option>
              <option value="cancelado">Pedidos Cancelados</option>
            </select>
          </div>
          <div className="col-12 col-md">
            <input className="form-control" type="search" placeholder="Buscar cliente o correo" value={filtroCliente} onChange={actualizarFiltro(setFiltroCliente)} />
          </div>
          <div className="col-12 col-md">
            <select className="form-select" value={filtroTotal} onChange={actualizarFiltro(setFiltroTotal)} aria-label="Filtrar por total">
              <option value="todos">Todos los totales</option>
              <option value="bajo">Menos de $200.000</option>
              <option value="medio">$200.000 a $500.000</option>
              <option value="alto">Más de $500.000</option>
            </select>
          </div>
          <div className="col-12 col-md">
            <input className="form-control" type="date" value={fechaDesde} onChange={actualizarFiltro(setFechaDesde)} aria-label="Fecha desde" />
          </div>
          <div className="col-12 col-md">
            <input className="form-control" type="date" value={fechaHasta} onChange={actualizarFiltro(setFechaHasta)} aria-label="Fecha hasta" />
          </div>
        </div>
      </div>

      {pedidosFiltrados.length > 0 && (
        <div className="admin-pagination-bar pedidos-pagination-bar">
          <label htmlFor="pedidos-por-pagina">Mostrar</label>
          <select className="admin-pagination-select" id="pedidos-por-pagina" value={pedidosPorPagina} onChange={cambiarCantidad}>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span>pedidos</span>
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

      <div className="row g-4 empleado-pedidos-grid">
        {pedidosVisibles.map((pedido) => {
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
        {pedidosFiltrados.length === 0 && (
          <div className="admin-order-empty text-center text-muted py-5">
            <i className="bi bi-bag fs-2 d-block mb-2"></i>
            <p>{pedidos.length ? 'No hay pedidos que coincidan con los filtros.' : 'No hay pedidos registrados.'}</p>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
