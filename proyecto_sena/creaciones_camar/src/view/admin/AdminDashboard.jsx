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
  const [loading, setLoading] = useState(true);

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
      <HomeNavbar role="admin" />
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <p className="dashboard-kicker">Panel administrativo</p>
            <h1>Dashboard</h1>
          </div>
          <span className="dashboard-badge">Bienvenido</span>
        </div>

      <div className="dashboard-stats row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card stat-card stat-usuarios h-100">
            <div className="card-body">
              <h6>Usuarios</h6>
              <h2>{stats.totalUsuarios}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card stat-card stat-productos h-100">
            <div className="card-body">
              <h6>Productos</h6>
              <h2>{stats.totalProductos}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card stat-card stat-pedidos h-100">
            <div className="card-body">
              <h6>Pedidos Totales</h6>
              <h2>{stats.totalPedidos}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="dashboard-card stat-card stat-pendientes h-100">
            <div className="card-body">
              <h6>Pedidos Pendientes</h6>
              <h2>{stats.pedidosPendientes}</h2>
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
                <a href="/admin/usuarios" className="btn btn-main text-start">
                  <i className="bi bi-people me-2"></i> Gestionar usuarios
                </a>
                <a href="/admin/productos" className="btn btn-main text-start">
                  <i className="bi bi-box me-2"></i> Gestionar productos
                </a>
                <a href="/admin/pedidos" className="btn btn-main text-start">
                  <i className="bi bi-bag me-2"></i> Ver pedidos
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
              <p className="info-title">
                <strong>Sistema de Gestión Creaciones Camar</strong>
              </p>
              <p className="info-copy mb-0">
                Panel administrativo para la gestión de productos, usuarios y pedidos.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
