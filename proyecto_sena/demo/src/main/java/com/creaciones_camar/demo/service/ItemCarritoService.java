package com.creaciones_camar.demo.service;

import com.creaciones_camar.demo.model.ItemCarrito;
import com.creaciones_camar.demo.repository.ItemCarritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ItemCarritoService {
    @Autowired
    private ItemCarritoRepository itemCarritoRepository;

    // CREATE
    public ItemCarrito agregarAlCarrito(ItemCarrito item) {
        return itemCarritoRepository.save(item);
    }

    // READ
    public Optional<ItemCarrito> obtenerPorId(Long id) {
        return itemCarritoRepository.findById(id);
    }

    public List<ItemCarrito> obtenerCarritoPorUsuario(Long usuarioId) {
        return itemCarritoRepository.findByUsuarioId(usuarioId);
    }

    public Optional<ItemCarrito> buscarItem(Long usuarioId, Long productoId, String talla) {
        return itemCarritoRepository.findByUsuarioIdAndProductoIdAndTalla(usuarioId, productoId, talla);
    }

    // UPDATE
    public ItemCarrito actualizarCantidad(Long id, Integer cantidad) {
        Optional<ItemCarrito> existente = itemCarritoRepository.findById(id);
        if (existente.isPresent()) {
            ItemCarrito item = existente.get();
            item.setCantidad(cantidad);
            return itemCarritoRepository.save(item);
        }
        return null;
    }

    // DELETE
    public boolean eliminarDelCarrito(Long id) {
        Optional<ItemCarrito> existente = itemCarritoRepository.findById(id);
        if (existente.isPresent()) {
            itemCarritoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void vaciarCarrito(Long usuarioId) {
        itemCarritoRepository.deleteByUsuarioId(usuarioId);
    }
}
