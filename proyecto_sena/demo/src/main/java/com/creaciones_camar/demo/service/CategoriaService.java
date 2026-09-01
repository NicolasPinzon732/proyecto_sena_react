package com.creaciones_camar.demo.service;

import com.creaciones_camar.demo.model.Categoria;
import com.creaciones_camar.demo.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;

    // CREATE
    public Categoria crearCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    // READ
    public Optional<Categoria> obtenerPorId(Long id) {
        return categoriaRepository.findById(id);
    }

    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll();
    }

    public List<Categoria> obtenerActivas() {
        return categoriaRepository.findByActivoTrue();
    }

    // UPDATE
    public Categoria actualizarCategoria(Long id, Categoria categoriaActualizada) {
        Optional<Categoria> existente = categoriaRepository.findById(id);
        if (existente.isPresent()) {
            Categoria categoria = existente.get();
            if (categoriaActualizada.getTipoCategoria() != null) {
                categoria.setTipoCategoria(categoriaActualizada.getTipoCategoria());
            }
            if (categoriaActualizada.getDescripcion() != null) {
                categoria.setDescripcion(categoriaActualizada.getDescripcion());
            }
            return categoriaRepository.save(categoria);
        }
        return null;
    }

    // DELETE
    public boolean eliminarCategoria(Long id) {
        Optional<Categoria> existente = categoriaRepository.findById(id);
        if (existente.isPresent()) {
            Categoria categoria = existente.get();
            categoria.setActivo(false);
            categoriaRepository.save(categoria);
            return true;
        }
        return false;
    }
}
