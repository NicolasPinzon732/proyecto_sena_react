package com.creaciones_camar.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.stereotype.Service;

import com.creaciones_camar.demo.model.Producto;
import com.creaciones_camar.demo.model.ProductoTalla;
import com.creaciones_camar.demo.model.Talla;
import com.creaciones_camar.demo.repository.ProductoTallaRepository;
import com.creaciones_camar.demo.repository.TallaRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class StockTallaService {
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final ProductoTallaRepository productoTallaRepository;
    private final TallaRepository tallaRepository;

    public StockTallaService(ProductoTallaRepository productoTallaRepository, TallaRepository tallaRepository) {
        this.productoTallaRepository = productoTallaRepository;
        this.tallaRepository = tallaRepository;
    }

    public List<StockTalla> leer(Producto producto) {
        if (producto.getTallas() == null || producto.getTallas().isBlank()) return new ArrayList<>();

        try {
            return objectMapper.readValue(producto.getTallas(), new TypeReference<List<StockTalla>>() {});
        } catch (JsonProcessingException ignored) {
            List<StockTalla> tallas = new ArrayList<>();
            String[] nombres = producto.getTallas().split(",");
            int stock = producto.getStockTotal() == null ? 0 : producto.getStockTotal().intValue();
            int base = nombres.length == 0 ? 0 : stock / nombres.length;
            int sobrante = nombres.length == 0 ? 0 : stock % nombres.length;
            for (int index = 0; index < nombres.length; index++) {
                if (!nombres[index].trim().isEmpty()) {
                    tallas.add(new StockTalla(nombres[index].trim(), base + (index < sobrante ? 1 : 0)));
                }
            }
            return tallas;
        }
    }

    public void descontar(Producto producto, String tallaSolicitada, int cantidad) {
        Optional<ProductoTalla> relacion = productoTallaRepository.findByProductoIdAndTallaNombreIgnoreCase(
                producto.getId(), tallaSolicitada);
        if (relacion.isPresent()) {
            ProductoTalla productoTalla = relacion.get();
            if (productoTalla.getCantidad() < cantidad) {
                throw new IllegalStateException("No hay stock suficiente para la talla " + productoTalla.getTalla().getNombre());
            }
            productoTalla.setCantidad(productoTalla.getCantidad() - cantidad);
            productoTallaRepository.save(productoTalla);
            producto.setStockTotal(productoTallaRepository.findByProductoId(producto.getId()).stream()
                    .mapToInt(item -> item.getCantidad() == null ? 0 : item.getCantidad().intValue()).sum());
            return;
        }

        List<StockTalla> tallas = leer(producto);
        StockTalla talla = tallas.stream()
                .filter(item -> item.getTalla().equalsIgnoreCase(tallaSolicitada == null ? "" : tallaSolicitada.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("La talla seleccionada no existe"));

        if (talla.getCantidad() < cantidad) {
            throw new IllegalStateException("No hay stock suficiente para la talla " + talla.getTalla());
        }

        talla.setCantidad(talla.getCantidad() - cantidad);
        producto.setTallas(escribir(tallas));
        producto.setStockTotal(tallas.stream().mapToInt(StockTalla::getCantidad).sum());
    }

    public void sincronizar(Producto producto) {
        productoTallaRepository.deleteByProductoId(producto.getId());
        for (StockTalla stockTalla : leer(producto)) {
            Talla talla = tallaRepository.findByNombreIgnoreCase(stockTalla.getTalla())
                    .orElseGet(() -> tallaRepository.save(new Talla(null, stockTalla.getTalla())));
            productoTallaRepository.save(new ProductoTalla(producto, talla, stockTalla.getCantidad()));
        }
    }

    public String escribir(List<StockTalla> tallas) {
        try {
            return objectMapper.writeValueAsString(tallas);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("No se pudo guardar el stock por talla", exception);
        }
    }

    public static class StockTalla {
        private String talla;
        private int cantidad;

        public StockTalla() {}

        public StockTalla(String talla, int cantidad) {
            this.talla = talla;
            this.cantidad = cantidad;
        }

        public String getTalla() { return talla; }
        public void setTalla(String talla) { this.talla = talla; }
        public int getCantidad() { return cantidad; }
        public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    }
}