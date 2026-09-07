package com.creaciones_camar.demo.controller;

import com.creaciones_camar.demo.model.Producto;
import com.creaciones_camar.demo.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {
    private static final Path DIRECTORIO_IMAGENES = Paths.get("uploads", "productos").toAbsolutePath().normalize();

    @Autowired
    private ProductoService productoService;

    @PostMapping("/imagenes")
    public ResponseEntity<Map<String, String>> subirImagen(@RequestParam("imagen") MultipartFile imagen) {
        if (imagen == null || imagen.isEmpty()) {
            throw new IllegalArgumentException("Selecciona una imagen.");
        }
        if (imagen.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("La imagen no puede superar los 5 MB.");
        }

        String tipoContenido = imagen.getContentType() == null ? "" : imagen.getContentType().toLowerCase();
        if (!Set.of("image/jpeg", "image/png", "image/webp", "image/gif").contains(tipoContenido)) {
            throw new IllegalArgumentException("Solo se permiten imágenes JPG, PNG, WEBP o GIF.");
        }

        try {
            Files.createDirectories(DIRECTORIO_IMAGENES);
            String extension = switch (tipoContenido) {
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                case "image/gif" -> ".gif";
                default -> ".jpg";
            };
            String nombreArchivo = UUID.randomUUID() + extension;
            Files.copy(imagen.getInputStream(), DIRECTORIO_IMAGENES.resolve(nombreArchivo));
            return ResponseEntity.ok(Map.of("url", "/api/productos/imagenes/" + nombreArchivo));
        } catch (IOException exception) {
            throw new IllegalStateException("No se pudo guardar la imagen.", exception);
        }
    }

    @GetMapping("/imagenes/{nombreArchivo:.+}")
    public ResponseEntity<Resource> obtenerImagen(@PathVariable String nombreArchivo) {
        Path archivo = DIRECTORIO_IMAGENES.resolve(nombreArchivo).normalize();
        if (!archivo.getParent().equals(DIRECTORIO_IMAGENES) || !Files.exists(archivo)) {
            return ResponseEntity.notFound().build();
        }
        Resource recurso = new FileSystemResource(archivo);
        String tipo = "image/jpeg";
        try {
            String detectado = Files.probeContentType(archivo);
            if (detectado != null) tipo = detectado;
        } catch (IOException ignored) {
            // Usa JPEG como tipo predeterminado si el sistema no detecta el archivo.
        }
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(tipo)).body(recurso);
    }

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoService.crearProducto(producto);
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Producto>> obtenerTodos() {
        List<Producto> productos = productoService.obtenerTodos();
        return new ResponseEntity<>(productos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        Optional<Producto> producto = productoService.obtenerPorId(id);
        return producto.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Producto>> obtenerActivos() {
        List<Producto> productos = productoService.obtenerActivos();
        return new ResponseEntity<>(productos, HttpStatus.OK);
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Producto>> obtenerPorCategoria(@PathVariable Long categoriaId) {
        List<Producto> productos = productoService.obtenerPorCategoria(categoriaId);
        return new ResponseEntity<>(productos, HttpStatus.OK);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscarPorNombre(@RequestParam String nombre) {
        List<Producto> productos = productoService.buscarPorNombre(nombre);
        return new ResponseEntity<>(productos, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto productoActualizado) {
        Producto productoActual = productoService.actualizarProducto(id, productoActualizado);
        if (productoActual != null) {
            return new ResponseEntity<>(productoActual, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        if (productoService.eliminarProducto(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/activar")
    public ResponseEntity<Void> activarProducto(@PathVariable Long id) {
        productoService.activarProducto(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivarProducto(@PathVariable Long id) {
        productoService.desactivarProducto(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<java.util.Map<String, String>> manejarValidacion(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<java.util.Map<String, String>> manejarCarga(IllegalStateException exception) {
        return ResponseEntity.internalServerError().body(java.util.Map.of("message", exception.getMessage()));
    }
}
