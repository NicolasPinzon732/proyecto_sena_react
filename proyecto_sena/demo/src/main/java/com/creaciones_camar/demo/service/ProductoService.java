package com.creaciones_camar.demo.service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import com.creaciones_camar.demo.model.Producto;
import com.creaciones_camar.demo.repository.CategoriaRepository;
import com.creaciones_camar.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private StockTallaService stockTallaService;

    @Autowired
    private CategoriaRepository categoriaRepository;

    // CREATE
    @Transactional
    public Producto crearProducto(Producto producto) {
        validarProducto(producto);
        if (producto.getActivo() == null) {
            producto.setActivo(true);
        }
        producto.setCategoria(obtenerCategoriaActiva(producto.getCategoria().getId()));
        Producto guardado = productoRepository.save(producto);
        stockTallaService.sincronizar(guardado);
        return guardado;
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
    @Transactional
    public Producto actualizarProducto(Long id, Producto productoActualizado) {
        Optional<Producto> existente = productoRepository.findById(id);
        if (existente.isPresent()) {
            Producto producto = existente.get();
            if (productoActualizado.getNombre() != null) producto.setNombre(productoActualizado.getNombre());
            if (productoActualizado.getDescripcion() != null) producto.setDescripcion(productoActualizado.getDescripcion());
            if (productoActualizado.getDescripcionCorta() != null) producto.setDescripcionCorta(productoActualizado.getDescripcionCorta());
            if (productoActualizado.getPrecio() != null) producto.setPrecio(productoActualizado.getPrecio());
            if (productoActualizado.getStockTotal() != null) producto.setStockTotal(productoActualizado.getStockTotal());
            if (productoActualizado.getImagen() != null) producto.setImagen(productoActualizado.getImagen());
            if (productoActualizado.getCategoria() != null) {
                producto.setCategoria(obtenerCategoriaActiva(productoActualizado.getCategoria().getId()));
            }
            if (productoActualizado.getTallas() != null) producto.setTallas(productoActualizado.getTallas());
            validarProducto(producto);
            Producto guardado = productoRepository.save(producto);
            stockTallaService.sincronizar(guardado);
            return guardado;
        }
        return null;
    }

    private void validarProducto(Producto producto) {
        if (producto == null) {
            throw new IllegalArgumentException("El producto no puede ser nulo.");
        }
        if (producto.getNombre() == null || producto.getNombre().trim().length() < 2 || producto.getNombre().trim().length() > 150) {
            throw new IllegalArgumentException("El nombre del producto debe tener entre 2 y 150 caracteres.");
        }
        if (producto.getPrecio() == null || producto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor que cero.");
        }
        if (producto.getCategoria() == null || producto.getCategoria().getId() == null) {
            throw new IllegalArgumentException("La categoría es obligatoria.");
        }
        if (Boolean.FALSE.equals(producto.getCategoria().getActivo())) {
            throw new IllegalArgumentException("La categoría seleccionada no está disponible.");
        }
        if (producto.getTallas() == null || producto.getTallas().isBlank()) {
            throw new IllegalArgumentException("Debes registrar al menos una talla.");
        }
        List<StockTallaService.StockTalla> tallas = stockTallaService.leer(producto);
        if (tallas.isEmpty()) {
            throw new IllegalArgumentException("Debes registrar al menos una talla válida.");
        }
        Set<String> nombresTalla = new HashSet<>();
        int stockCalculado = 0;
        for (StockTallaService.StockTalla talla : tallas) {
            if (talla.getTalla() == null || talla.getTalla().isBlank()) {
                throw new IllegalArgumentException("Cada talla debe tener un nombre.");
            }
            if (talla.getCantidad() < 0) {
                throw new IllegalArgumentException("La cantidad de una talla no puede ser negativa.");
            }
            if (!nombresTalla.add(talla.getTalla().trim().toLowerCase(Locale.ROOT))) {
                throw new IllegalArgumentException("No se permiten tallas duplicadas en el producto.");
            }
            stockCalculado += talla.getCantidad();
        }
        producto.setStockTotal(stockCalculado);
        producto.setNombre(producto.getNombre().trim());
    }

    private com.creaciones_camar.demo.model.Categoria obtenerCategoriaActiva(Long categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .filter(categoria -> !Boolean.FALSE.equals(categoria.getActivo()))
                .orElseThrow(() -> new IllegalArgumentException("La categoría seleccionada no existe o no está disponible."));
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
