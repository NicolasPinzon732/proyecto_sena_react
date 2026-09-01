package com.creaciones_camar.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creaciones_camar.demo.model.Pedido;
import com.creaciones_camar.demo.repository.PedidoRepository;

@Service
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;

    // CREATE
    public Pedido crearPedido(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("El pedido no puede ser nulo");
        }

        if (pedido.getDetalles() != null && !pedido.getDetalles().isEmpty()) {
            for (var detalle : pedido.getDetalles()) {
                if (detalle != null) {
                    detalle.setPedido(pedido);
                }
            }
        }

        return pedidoRepository.save(pedido);
    }

    // READ
    public Optional<Pedido> obtenerPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    public List<Pedido> obtenerTodos() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> obtenerPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public List<Pedido> obtenerPorEstado(String estado) {
        return pedidoRepository.findByEstado(estado);
    }

    // UPDATE
    public Pedido actualizarPedido(Long id, Pedido pedidoActualizado) {
        Optional<Pedido> existente = pedidoRepository.findById(id);
        if (existente.isPresent()) {
            Pedido pedido = existente.get();
            if (pedidoActualizado.getEstado() != null) pedido.setEstado(pedidoActualizado.getEstado());
            if (pedidoActualizado.getPais() != null) pedido.setPais(pedidoActualizado.getPais());
            if (pedidoActualizado.getCiudad() != null) pedido.setCiudad(pedidoActualizado.getCiudad());
            if (pedidoActualizado.getDireccion() != null) pedido.setDireccion(pedidoActualizado.getDireccion());
            if (pedidoActualizado.getCodigoPostal() != null) pedido.setCodigoPostal(pedidoActualizado.getCodigoPostal());
            return pedidoRepository.save(pedido);
        }
        return null;
    }

    // DELETE
    public void eliminarPedido(Long id) {
        pedidoRepository.deleteById(id);
    }

    public void cambiarEstado(Long id, String nuevoEstado) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        pedido.ifPresent(p -> {
            p.setEstado(nuevoEstado);
            pedidoRepository.save(p);
        });
    }
}
