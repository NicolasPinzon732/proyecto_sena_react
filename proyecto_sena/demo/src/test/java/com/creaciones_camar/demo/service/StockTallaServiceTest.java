package com.creaciones_camar.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.creaciones_camar.demo.model.Producto;
import com.creaciones_camar.demo.model.ProductoTalla;
import com.creaciones_camar.demo.model.Talla;
import com.creaciones_camar.demo.repository.ProductoTallaRepository;
import com.creaciones_camar.demo.repository.TallaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class StockTallaServiceTest {

    @Mock
    private ProductoTallaRepository productoTallaRepository;

    @Mock
    private TallaRepository tallaRepository;

    @Test
    void descontar_debeActualizarStockPorTallaYProducto() throws Exception {
        StockTallaService service = new StockTallaService(productoTallaRepository, tallaRepository);
        Producto producto = new Producto();
        producto.setId(5L);
        producto.setStockTotal(11);
        producto.setTallas("[{\"talla\":\"M\",\"cantidad\":8},{\"talla\":\"L\",\"cantidad\":3}]");

        Talla talla = new Talla(1L, "M");
        ProductoTalla productoTalla = new ProductoTalla(producto, talla, 8);
        when(productoTallaRepository.findByProductoIdAndTallaNombreIgnoreCase(5L, "M"))
                .thenReturn(Optional.of(productoTalla));
        when(productoTallaRepository.findByProductoId(5L)).thenReturn(List.of(productoTalla));

        service.descontar(producto, "M", 2);

        assertEquals(6, productoTalla.getCantidad());
        assertEquals(6, producto.getStockTotal());
        assertEquals(6, new ObjectMapper().readTree(producto.getTallas()).get(0).get("cantidad").asInt());
        assertEquals(3, new ObjectMapper().readTree(producto.getTallas()).get(1).get("cantidad").asInt());
        verify(productoTallaRepository).save(any(ProductoTalla.class));
    }
}