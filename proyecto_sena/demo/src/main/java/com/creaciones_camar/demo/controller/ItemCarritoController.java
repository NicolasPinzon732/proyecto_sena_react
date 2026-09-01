package com.creaciones_camar.demo.controller;

import com.creaciones_camar.demo.model.ItemCarrito;
import com.creaciones_camar.demo.service.ItemCarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "*")
public class ItemCarritoController {
    @Autowired
    private ItemCarritoService itemCarritoService;

    @PostMapping
    public ResponseEntity<ItemCarrito> agregarAlCarrito(@RequestBody ItemCarrito item) {
        ItemCarrito nuevoItem = itemCarritoService.agregarAlCarrito(item);
        return new ResponseEntity<>(nuevoItem, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemCarrito> obtenerPorId(@PathVariable Long id) {
        Optional<ItemCarrito> item = itemCarritoService.obtenerPorId(id);
        return item.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ItemCarrito>> obtenerCarritoPorUsuario(@PathVariable Long usuarioId) {
        List<ItemCarrito> items = itemCarritoService.obtenerCarritoPorUsuario(usuarioId);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @GetMapping("/buscar")
    public ResponseEntity<ItemCarrito> buscarItem(
            @RequestParam Long usuarioId,
            @RequestParam Long productoId,
            @RequestParam String talla) {
        Optional<ItemCarrito> item = itemCarritoService.buscarItem(usuarioId, productoId, talla);
        return item.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemCarrito> actualizarCantidad(@PathVariable Long id, @RequestParam Integer cantidad) {
        ItemCarrito itemActualizado = itemCarritoService.actualizarCantidad(id, cantidad);
        if (itemActualizado != null) {
            return new ResponseEntity<>(itemActualizado, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDelCarrito(@PathVariable Long id) {
        if (itemCarritoService.eliminarDelCarrito(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/usuario/{usuarioId}")
    public ResponseEntity<Void> vaciarCarrito(@PathVariable Long usuarioId) {
        itemCarritoService.vaciarCarrito(usuarioId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
