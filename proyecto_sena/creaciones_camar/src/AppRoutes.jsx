import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Auth
import LoginForm from './view/auth/LoginForm';
import RegisterForm from './view/auth/RegisterForm';
import { ProtectedRoute } from './auth/ProtectedRoute';

// Admin
import AdminDashboard from './view/admin/AdminDashboard';
import UsuariosList from './view/admin/UsuariosList';
import UsuariosInactivos from './view/admin/UsuariosInactivos';
import UsuarioForm from './view/admin/UsuarioForm';
import ProductosList from './view/admin/ProductosList';
import ProductoForm from './view/admin/ProductoForm';
import PedidosList from './view/admin/PedidosList';

// Cliente
import AppCliente from './view/cliente/AppCliente';
import Catalogo from './view/cliente/catalogo';
import DetalleProducto from './view/cliente/detalleProducto';
import Carrito from './view/cliente/carrito';
import Checkout from './view/cliente/checkout';
import Pedidos from './view/cliente/pedidos';

// Empleado
import EmpleadoDashboard from './view/empleado/EmpleadoDashboard';
import PedidosEmpleado from './view/empleado/PedidosEmpleado';
import Home from './view/Home';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRol="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/usuarios" element={<ProtectedRoute requiredRol="admin"><UsuariosList /></ProtectedRoute>} />
        <Route path="/admin/usuarios/inactivos" element={<ProtectedRoute requiredRol="admin"><UsuariosInactivos /></ProtectedRoute>} />
        <Route path="/admin/usuarios/crear" element={<ProtectedRoute requiredRol="admin"><UsuarioForm /></ProtectedRoute>} />
        <Route path="/admin/usuarios/:id/editar" element={<ProtectedRoute requiredRol="admin"><UsuarioForm /></ProtectedRoute>} />
        <Route path="/admin/productos" element={<ProtectedRoute requiredRol="admin"><ProductosList /></ProtectedRoute>} />
        <Route path="/admin/productos/crear" element={<ProtectedRoute requiredRol="admin"><ProductoForm /></ProtectedRoute>} />
        <Route path="/admin/productos/:id/editar" element={<ProtectedRoute requiredRol="admin"><ProductoForm /></ProtectedRoute>} />
        <Route path="/admin/pedidos" element={<ProtectedRoute requiredRol="admin"><PedidosList /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute requiredRol={["admin", "empleado"]}><UsuarioForm self /></ProtectedRoute>} />

        <Route path="/cliente" element={<AppCliente />}>
          <Route index element={<Catalogo />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="producto/:id" element={<DetalleProducto />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="pedidos" element={<Pedidos />} />
        </Route>

        <Route path="/empleado" element={<ProtectedRoute requiredRol="empleado"><EmpleadoDashboard /></ProtectedRoute>} />
        <Route path="/empleado/pedidos" element={<ProtectedRoute requiredRol="empleado"><PedidosEmpleado /></ProtectedRoute>} />

        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
