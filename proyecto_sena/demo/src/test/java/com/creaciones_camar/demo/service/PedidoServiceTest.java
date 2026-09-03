package com.creaciones_camar.demo.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.creaciones_camar.demo.model.DetallePedido;
import com.creaciones_camar.demo.model.Pedido;
import com.creaciones_camar.demo.model.Producto;
import com.creaciones_camar.demo.model.Usuario;
import com.creaciones_camar.demo.repository.PedidoRepository;
import com.creaciones_camar.demo.repository.ProductoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private StockTallaService stockTallaService;

    @InjectMocks
    private PedidoService pedidoService;

    @Test
    void crearPedido_debeAsignarPedidoAlosDetalles() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);

        Producto producto = new Producto();
        producto.setId(5L);

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setTotal(BigDecimal.valueOf(150000));
        pedido.setEstado("pendiente");

        DetallePedido detalle = new DetallePedido();
        detalle.setProducto(producto);
        detalle.setCantidad(2);
        detalle.setPrecioUnitario(BigDecimal.valueOf(75000));
        detalle.setTalla("M");
        pedido.setDetalles(List.of(detalle));

        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocation -> invocation.getArgument(0));
        producto.setNombre("Chaqueta");
        producto.setStockTotal(8);
        producto.setTallas("[{\"talla\":\"M\",\"cantidad\":8}]");
        when(productoRepository.findById(5L)).thenReturn(java.util.Optional.of(producto));

        Pedido guardado = pedidoService.crearPedido(pedido);

        assertNotNull(guardado.getDetalles());
        assertSame(guardado, guardado.getDetalles().get(0).getPedido());
    }

    @Test
    void serializarPedido_noDebeGenerarRecursionJson() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setId(3L);
        usuario.setNombres("Cliente");

        Pedido pedido = new Pedido();
        pedido.setId(12L);
        pedido.setUsuario(usuario);
        pedido.setTotal(BigDecimal.valueOf(150000));
        pedido.setEstado("pendiente");

        Producto producto = new Producto();
        producto.setId(7L);
        producto.setNombre("Chaqueta");
        producto.setPrecio(BigDecimal.valueOf(75000));

        DetallePedido detalle = new DetallePedido();
        detalle.setId(99L);
        detalle.setPedido(pedido);
        detalle.setProducto(producto);
        detalle.setCantidad(2);
        detalle.setPrecioUnitario(BigDecimal.valueOf(75000));
        detalle.setTalla("M");
        pedido.setDetalles(List.of(detalle));

        String json = new ObjectMapper().writeValueAsString(pedido);

        assertTrue(json.contains("\"detalles\""));
        assertFalse(json.contains("\"pedido\":{\"id\":12"));
    }
}
