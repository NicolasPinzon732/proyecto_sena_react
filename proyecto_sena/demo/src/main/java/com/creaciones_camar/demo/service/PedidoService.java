package com.creaciones_camar.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.creaciones_camar.demo.model.Ciudad;
import com.creaciones_camar.demo.model.DetallePedido;
import com.creaciones_camar.demo.model.Pais;
import com.creaciones_camar.demo.model.Pedido;
import com.creaciones_camar.demo.model.Producto;
import com.creaciones_camar.demo.repository.CiudadRepository;
import com.creaciones_camar.demo.repository.MetodoPagoRepository;
import com.creaciones_camar.demo.repository.PaisRepository;
import com.creaciones_camar.demo.repository.PedidoRepository;
import com.creaciones_camar.demo.repository.ProductoRepository;

@Service
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private StockTallaService stockTallaService;

    @Autowired
    private CiudadRepository ciudadRepository;

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @Autowired
    private PaisRepository paisRepository;

    // CREATE
    @Transactional
    public Pedido crearPedido(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("El pedido no puede ser nulo");
        }

        if (pedido.getCiudad() != null && pedido.getPais() != null) {
            Pais pais = paisRepository.findByNombreIgnoreCase(pedido.getPais())
                    .orElseThrow(() -> new IllegalArgumentException("El país seleccionado no está disponible"));
            pedido.setPaisNormalizado(pais);
            Ciudad ciudad = ciudadRepository.findByNombreIgnoreCaseAndPaisNombreIgnoreCase(
                pedido.getCiudad(), pedido.getPais())
                .orElseThrow(() -> new IllegalArgumentException("La ciudad no pertenece al país seleccionado"));
            pedido.setCiudadNormalizada(ciudad);
        }
        if (pedido.getMetodoPagoNombre() != null && !pedido.getMetodoPagoNombre().isBlank()) {
            pedido.setMetodoPago(metodoPagoRepository.findByNombreIgnoreCase(pedido.getMetodoPagoNombre())
                .orElseThrow(() -> new IllegalArgumentException("El método de pago no está disponible")));
        }

        if (pedido.getDetalles() != null && !pedido.getDetalles().isEmpty()) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                if (detalle != null) {
                    if (detalle.getProducto() == null || detalle.getProducto().getId() == null) {
                        throw new IllegalArgumentException("Cada detalle debe tener un producto válido");
                    }

                    Producto producto = productoRepository.findById(detalle.getProducto().getId())
                            .orElseThrow(() -> new IllegalArgumentException("El producto no existe"));
                    int cantidad = detalle.getCantidad() == null ? 0 : detalle.getCantidad();

                    if (cantidad <= 0) {
                        throw new IllegalArgumentException("La cantidad del producto debe ser mayor que cero");
                    }
                    if (detalle.getTalla() == null || detalle.getTalla().isBlank()) {
                        throw new IllegalArgumentException("Cada detalle debe tener una talla válida");
                    }

                    stockTallaService.descontar(producto, detalle.getTalla(), cantidad);
                    productoRepository.save(producto);
                    detalle.setProducto(producto);
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
