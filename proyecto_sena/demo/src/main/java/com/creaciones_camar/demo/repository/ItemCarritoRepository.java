package com.creaciones_camar.demo.repository;

import com.creaciones_camar.demo.model.ItemCarrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
    List<ItemCarrito> findByUsuarioId(Long usuarioId);
    Optional<ItemCarrito> findByUsuarioIdAndProductoIdAndTalla(Long usuarioId, Long productoId, String talla);
    void deleteByUsuarioId(Long usuarioId);
}
