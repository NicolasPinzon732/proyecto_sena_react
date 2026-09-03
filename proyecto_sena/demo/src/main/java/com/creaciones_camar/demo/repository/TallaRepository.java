package com.creaciones_camar.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.creaciones_camar.demo.model.Talla;

public interface TallaRepository extends JpaRepository<Talla, Long> {
    Optional<Talla> findByNombreIgnoreCase(String nombre);
}
