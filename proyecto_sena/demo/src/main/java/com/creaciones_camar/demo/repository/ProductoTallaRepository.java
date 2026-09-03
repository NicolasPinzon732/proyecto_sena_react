package com.creaciones_camar.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.creaciones_camar.demo.model.ProductoTalla;
import com.creaciones_camar.demo.model.ProductoTallaId;

public interface ProductoTallaRepository extends JpaRepository<ProductoTalla, ProductoTallaId> {
    List<ProductoTalla> findByProductoId(Long productoId);
    Optional<ProductoTalla> findByProductoIdAndTallaNombreIgnoreCase(Long productoId, String nombre);
    void deleteByProductoId(Long productoId);
}
