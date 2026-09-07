import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeNavbar from '../shared/HomeNavbar';

export default function EmpleadoDashboard() {
  const [stats, setStats] = useState({
    pedidosPendientes: 0,
    pedidosEnvio: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const pedidosRes = await fetch('http://localhost:8080/api/pedidos');
        const pedidos = await pedidosRes.json();

        const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;
        const pedidosEnvio = pedidos.filter(p => p.estado === 'confirmado').length;

        setStats({
          pedidosPendientes,
          pedidosEnvio,
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <HomeNavbar role="empleado" />
      <div className="dashboard-shell admin-dashboard-shell">
        <div className="dashboard-header dashboard-hero">
          <div>
            <p className="dashboard-kicker">Creaciones Camar · Operación</p>
            <h1>Dashboard del empleado</h1>
            <p className="dashboard-hero-copy">Gestiona pedidos y prepara cada entrega desde un solo lugar.</p>
          </div>
          <div className="dashboard-hero-mark" aria-hidden="true"><i className="bi bi-clipboard-check-fill"></i></div>
        </div>

      <div className="dashboard-stats row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="dashboard-card stat-card stat-pendientes h-100">
            <div className="card-body">
              <div className="stat-card-icon"><i className="bi bi-clock-history"></i></div>
              <h6>Pedidos Pendientes</h6>
              <h2>{stats.pedidosPendientes}</h2>
              <small>Requieren confirmación</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="dashboard-card stat-card stat-envios h-100">
            <div className="card-body">
              <div className="stat-card-icon"><i className="bi bi-truck"></i></div>
              <h6>Pedidos en Envío</h6>
              <h2>{stats.pedidosEnvio}</h2>
              <small>Listos para despacho</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5 g-4 dashboard-actions-row">
        <div className="col-12">
          <div className="dashboard-card panel-card dashboard-actions-card">
            <div className="panel-header">
              <div>
                <p className="dashboard-kicker">Gestiona tu operación</p>
                <h6>Acciones rápidas</h6>
              </div>
            </div>
            <div className="card-body dashboard-action-grid">
              <a href="/empleado/pedidos" className="dashboard-action-link">
                <i className="bi bi-bag-check-fill"></i><span>Gestionar pedidos</span><i className="bi bi-arrow-up-right"></i>
              </a>
              <a href="/empleado/envios" className="dashboard-action-link">
                <i className="bi bi-truck"></i><span>Registrar envíos</span><i className="bi bi-arrow-up-right"></i>
              </a>
              <a href="/perfil" className="dashboard-action-link">
                <i className="bi bi-person-fill"></i><span>Mi perfil</span><i className="bi bi-arrow-up-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
