package com.creaciones_camar.demo.service;

import java.math.BigDecimal;
import java.util.Set;
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
import com.creaciones_camar.demo.repository.UsuarioRepository;

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

    @Autowired
    private UsuarioRepository usuarioRepository;

    // CREATE
    @Transactional
    public Pedido crearPedido(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("El pedido no puede ser nulo");
        }

        if (pedido.getUsuario() == null || pedido.getUsuario().getId() == null) {
            throw new IllegalArgumentException("El usuario del pedido es obligatorio");
        }
        pedido.setUsuario(usuarioRepository.findById(pedido.getUsuario().getId())
            .filter(usuario -> !Boolean.FALSE.equals(usuario.getActivo()))
            .orElseThrow(() -> new IllegalArgumentException("El usuario del pedido no existe o está inactivo")));
        if (pedido.getDireccion() == null || pedido.getDireccion().isBlank()) {
            throw new IllegalArgumentException("La dirección de entrega es obligatoria");
        }
        if (pedido.getPais() == null || pedido.getPais().isBlank() || pedido.getCiudad() == null || pedido.getCiudad().isBlank()) {
            throw new IllegalArgumentException("El país y la ciudad son obligatorios");
        }
        pedido.setEstado("pendiente");
        BigDecimal subtotal = BigDecimal.ZERO;

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

        if (pedido.getDetalles() == null || pedido.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("El pedido debe tener al menos un producto");
        }

        if (pedido.getDetalles() != null && !pedido.getDetalles().isEmpty()) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                if (detalle != null) {
                    if (detalle.getProducto() == null || detalle.getProducto().getId() == null) {
                        throw new IllegalArgumentException("Cada detalle debe tener un producto válido");
                    }

                    Producto producto = productoRepository.findById(detalle.getProducto().getId())
                            .orElseThrow(() -> new IllegalArgumentException("El producto no existe"));
                    if (Boolean.FALSE.equals(producto.getActivo())) {
                        throw new IllegalArgumentException("El producto seleccionado no está disponible");
                    }
                    Integer cantidadValor = detalle.getCantidad();
                    int cantidad = cantidadValor == null ? 0 : cantidadValor.intValue();

                    if (cantidad <= 0) {
                        throw new IllegalArgumentException("La cantidad del producto debe ser mayor que cero");
                    }
                    if (detalle.getTalla() == null || detalle.getTalla().isBlank()) {
                        throw new IllegalArgumentException("Cada detalle debe tener una talla válida");
                    }

                    detalle.setPrecioUnitario(producto.getPrecio());
                    subtotal = subtotal.add(producto.getPrecio().multiply(BigDecimal.valueOf(cantidad)));
                    stockTallaService.descontar(producto, detalle.getTalla(), cantidad);
                    productoRepository.save(producto);
                    detalle.setProducto(producto);
                    detalle.setPedido(pedido);
                }
            }
        }

        pedido.setTotal(subtotal.add(BigDecimal.valueOf(12000)));

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
            if (pedidoActualizado.getEstado() != null) {
                String estadoNuevo = normalizarEstado(pedidoActualizado.getEstado());
                validarTransicion(pedido.getEstado(), estadoNuevo);
                pedido.setEstado(estadoNuevo);
            }
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
            String estadoNormalizado = normalizarEstado(nuevoEstado);
            validarTransicion(p.getEstado(), estadoNormalizado);
            p.setEstado(estadoNormalizado);
            pedidoRepository.save(p);
        });
    }

    @Transactional
    public Pedido cancelarPedido(Long id, Long usuarioId) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El pedido no existe"));
        if (pedido.getUsuario() == null || !pedido.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalArgumentException("No puedes cancelar este pedido");
        }

        validarTransicion(pedido.getEstado(), "cancelado");
        if (pedido.getDetalles() != null) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                Producto producto = productoRepository.findById(detalle.getProducto().getId())
                        .orElseThrow(() -> new IllegalArgumentException("El producto del pedido no existe"));
                stockTallaService.incrementar(producto, detalle.getTalla(), detalle.getCantidad());
                productoRepository.save(producto);
            }
        }

        pedido.setEstado("cancelado");
        return pedidoRepository.save(pedido);
    }

    private void validarEstado(String estado) {
        if (estado == null || !Set.of("pendiente", "confirmado", "enviado", "entregado", "cancelado")
                .contains(estado.trim().toLowerCase())) {
            throw new IllegalArgumentException("El estado del pedido no es válido");
        }
    }

    private String normalizarEstado(String estado) {
        validarEstado(estado);
        return estado.trim().toLowerCase();
    }

    private void validarTransicion(String estadoActual, String estadoNuevo) {
        String actual = estadoActual == null ? "pendiente" : estadoActual.trim().toLowerCase();
        if (actual.equals(estadoNuevo)) return;
        boolean permitida = switch (actual) {
            case "pendiente" -> Set.of("confirmado", "cancelado").contains(estadoNuevo);
            case "confirmado" -> Set.of("enviado", "cancelado").contains(estadoNuevo);
            case "enviado" -> estadoNuevo.equals("entregado");
            default -> false;
        };
        if (!permitida) {
            throw new IllegalArgumentException("La transición de estado del pedido no es válida");
        }
    }
}
