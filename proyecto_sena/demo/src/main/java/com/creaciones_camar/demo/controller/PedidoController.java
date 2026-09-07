package com.creaciones_camar.demo.controller;

import com.creaciones_camar.demo.model.Pedido;
import com.creaciones_camar.demo.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {
    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        Pedido nuevoPedido = pedidoService.crearPedido(pedido);
        return new ResponseEntity<>(nuevoPedido, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> obtenerTodos() {
        List<Pedido> pedidos = pedidoService.obtenerTodos();
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPorId(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoService.obtenerPorId(id);
        return pedido.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pedido>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        List<Pedido> pedidos = pedidoService.obtenerPorUsuario(usuarioId);
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Pedido>> obtenerPorEstado(@PathVariable String estado) {
        List<Pedido> pedidos = pedidoService.obtenerPorEstado(estado);
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedido> actualizarPedido(@PathVariable Long id, @RequestBody Pedido pedidoActualizado) {
        Pedido pedidoActual = pedidoService.actualizarPedido(id, pedidoActualizado);
        if (pedidoActual != null) {
            return new ResponseEntity<>(pedidoActual, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        pedidoService.eliminarPedido(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}/estado/{estado}")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Long id, @PathVariable String estado) {
        pedidoService.cambiarEstado(id, estado);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Pedido> cancelarPedido(@PathVariable Long id, @RequestBody java.util.Map<String, Long> datos) {
        Long usuarioId = datos == null ? null : datos.get("usuarioId");
        if (usuarioId == null) {
            throw new IllegalArgumentException("El usuario del pedido es obligatorio");
        }
        return ResponseEntity.ok(pedidoService.cancelarPedido(id, usuarioId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<java.util.Map<String, String>> manejarValidacion(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<java.util.Map<String, String>> manejarStock(IllegalStateException exception) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", exception.getMessage()));
    }
}
