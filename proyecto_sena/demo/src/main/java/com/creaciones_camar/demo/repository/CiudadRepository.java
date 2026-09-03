package com.creaciones_camar.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.creaciones_camar.demo.model.Ciudad;

public interface CiudadRepository extends JpaRepository<Ciudad, Long> {
    Optional<Ciudad> findByNombreIgnoreCaseAndPaisNombreIgnoreCase(String nombre, String pais);
}
