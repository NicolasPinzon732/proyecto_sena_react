package com.creaciones_camar.demo.service;

import com.creaciones_camar.demo.model.Producto;
import com.creaciones_camar.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    // CREATE
    public Producto crearProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    // READ
    public Optional<Producto> obtenerPorId(Long id) {
        return productoRepository.findById(id);
    }

    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    public List<Producto> obtenerActivos() {
        return productoRepository.findByActivoTrue();
    }

    public List<Producto> obtenerPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    // UPDATE
    public Producto actualizarProducto(Long id, Producto productoActualizado) {
        Optional<Producto> existente = productoRepository.findById(id);
        if (existente.isPresent()) {
            Producto producto = existente.get();
            if (productoActualizado.getNombre() != null) producto.setNombre(productoActualizado.getNombre());
            if (productoActualizado.getDescripcion() != null) producto.setDescripcion(productoActualizado.getDescripcion());
            if (productoActualizado.getPrecio() != null) producto.setPrecio(productoActualizado.getPrecio());
            if (productoActualizado.getStockTotal() != null) producto.setStockTotal(productoActualizado.getStockTotal());
            if (productoActualizado.getImagen() != null) producto.setImagen(productoActualizado.getImagen());
            if (productoActualizado.getCategoria() != null) producto.setCategoria(productoActualizado.getCategoria());
            if (productoActualizado.getTallas() != null) producto.setTallas(productoActualizado.getTallas());
            return productoRepository.save(producto);
        }
        return null;
    }

    // DELETE
    public boolean eliminarProducto(Long id) {
        Optional<Producto> existente = productoRepository.findById(id);
        if (existente.isPresent()) {
            Producto producto = existente.get();
            producto.setActivo(false);
            productoRepository.save(producto);
            return true;
        }
        return false;
    }

    public void desactivarProducto(Long id) {
        Optional<Producto> producto = productoRepository.findById(id);
        producto.ifPresent(p -> {
            p.setActivo(false);
            productoRepository.save(p);
        });
    }

    public void activarProducto(Long id) {
        Optional<Producto> producto = productoRepository.findById(id);
        producto.ifPresent(p -> {
            p.setActivo(true);
            productoRepository.save(p);
        });
    }
}
