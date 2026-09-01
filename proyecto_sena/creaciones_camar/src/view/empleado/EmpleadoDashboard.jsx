import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeNavbar from '../shared/HomeNavbar';

export default function EmpleadoDashboard() {
  const [stats, setStats] = useState({
    pedidosPendientes: 0,
    pedidosEnvio: 0,
  });
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><p>Cargando...</p></div>;
  }

  return (
    <>
      <HomeNavbar role="empleado" />
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <p className="dashboard-kicker">Panel de empleado</p>
            <h1>Dashboard</h1>
          </div>
          <span className="dashboard-badge">Empleado</span>
        </div>

      <div className="dashboard-stats row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="dashboard-card stat-card stat-pendientes h-100">
            <div className="card-body">
              <h6>Pedidos Pendientes</h6>
              <h2>{stats.pedidosPendientes}</h2>
              <small>Requieren confirmación</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="dashboard-card stat-card stat-envios h-100">
            <div className="card-body">
              <h6>Pedidos en Envío</h6>
              <h2>{stats.pedidosEnvio}</h2>
              <small>Listos para despacho</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5 g-4">
        <div className="col-lg-6">
          <div className="dashboard-card panel-card">
            <div className="panel-header">
              <h6>Acciones rápidas</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-2">
                <a href="/empleado/pedidos" className="btn btn-main text-start">
                  <i className="bi bi-bag me-2"></i> Gestionar pedidos
                </a>
                <a href="/empleado/envios" className="btn btn-main text-start">
                  <i className="bi bi-truck me-2"></i> Registrar envíos
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="dashboard-card panel-card">
            <div className="panel-header">
              <h6>Información</h6>
            </div>
            <div className="card-body">
              <p className="info-title mb-2">
                <strong>Rol: Empleado</strong>
              </p>
              <p className="info-copy mb-0">
                Panel para gestión de pedidos y envíos.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
