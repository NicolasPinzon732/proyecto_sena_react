import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeNavbar from '../shared/HomeNavbar';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalProductos: 0,
    totalPedidos: 0,
    pedidosPendientes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usuarios, productos, pedidos] = await Promise.all([
          fetch('http://localhost:8080/api/usuarios').then(r => r.json()),
          fetch('http://localhost:8080/api/productos').then(r => r.json()),
          fetch('http://localhost:8080/api/pedidos').then(r => r.json()),
        ]);

        const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;

        setStats({
          totalUsuarios: usuarios.length,
          totalProductos: productos.length,
          totalPedidos: pedidos.length,
          pedidosPendientes,
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <HomeNavbar role="admin" />
      <div className="dashboard-shell admin-dashboard-shell">
        <div className="dashboard-header dashboard-hero">
          <div>
            <p className="dashboard-kicker">Creaciones Camar · Administración</p>
            <h1>Dashboard</h1>
            <p className="dashboard-hero-copy">Todo lo importante de tu tienda, en un solo lugar.</p>
          </div>
          <div className="dashboard-hero-mark" aria-hidden="true"><i className="bi bi-bar-chart-line-fill"></i></div>
        </div>

      <div className="dashboard-stats row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card stat-card stat-usuarios h-100">
            <div className="card-body">
              <div className="stat-card-icon"><i className="bi bi-people-fill"></i></div>
              <h6>Usuarios</h6>
              <h2>{stats.totalUsuarios}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card stat-card stat-productos h-100">
            <div className="card-body">
              <div className="stat-card-icon"><i className="bi bi-box-seam-fill"></i></div>
              <h6>Productos</h6>
              <h2>{stats.totalProductos}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card stat-card stat-pedidos h-100">
            <div className="card-body">
              <div className="stat-card-icon"><i className="bi bi-bag-check-fill"></i></div>
              <h6>Pedidos Totales</h6>
              <h2>{stats.totalPedidos}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card stat-card stat-pendientes h-100">
            <div className="card-body">
              <div className="stat-card-icon"><i className="bi bi-clock-history"></i></div>
              <h6>Pedidos Pendientes</h6>
              <h2>{stats.pedidosPendientes}</h2>
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
                <a href="/admin/usuarios" className="dashboard-action-link">
                  <i className="bi bi-people-fill"></i><span>Gestionar usuarios</span><i className="bi bi-arrow-up-right"></i>
                </a>
                <a href="/admin/productos" className="dashboard-action-link">
                  <i className="bi bi-box-seam-fill"></i><span>Gestionar productos</span><i className="bi bi-arrow-up-right"></i>
                </a>
                <a href="/admin/pedidos" className="dashboard-action-link">
                  <i className="bi bi-bag-check-fill"></i><span>Ver pedidos</span><i className="bi bi-arrow-up-right"></i>
                </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
