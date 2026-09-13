package com.creaciones_camar.demo.service;

import com.creaciones_camar.demo.model.Categoria;
import com.creaciones_camar.demo.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CategoriaService {
    private static final Set<String> CATEGORIAS_PERMITIDAS = Set.of(
        "Impermeables",
        "Acolchonadas",
        "Deportivas",
        "Cuero",
        "Demin",
        "Chaqueta de cuero",
        "De denim",
        "De demin"
    );

    private static final Set<String> CATEGORIAS_PERMITIDAS_NORMALIZADAS = CATEGORIAS_PERMITIDAS.stream()
        .map(valor -> valor.toLowerCase(Locale.ROOT).replaceAll("\\s+", " "))
        .collect(Collectors.toSet());

    @Autowired
    private CategoriaRepository categoriaRepository;

    // CREATE
    public Categoria crearCategoria(Categoria categoria) {
        if (categoria == null || categoria.getTipoCategoria() == null || categoria.getTipoCategoria().isBlank()) {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }
        categoria.setTipoCategoria(normalizarCategoria(categoria.getTipoCategoria()));
        return categoriaRepository.save(categoria);
    }

    // READ
    public Optional<Categoria> obtenerPorId(Long id) {
        return categoriaRepository.findById(id)
            .filter(c -> esCategoriaPermitida(c.getTipoCategoria()));
    }

    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll().stream()
            .filter(c -> esCategoriaPermitida(c.getTipoCategoria()))
            .toList();
    }

    public List<Categoria> obtenerActivas() {
        return categoriaRepository.findByActivoTrue().stream()
            .filter(c -> esCategoriaPermitida(c.getTipoCategoria()))
            .toList();
    }

    // UPDATE
    public Categoria actualizarCategoria(Long id, Categoria categoriaActualizada) {
        Optional<Categoria> existente = categoriaRepository.findById(id);
        if (existente.isPresent()) {
            Categoria categoria = existente.get();
            if (categoriaActualizada.getTipoCategoria() != null) {
                categoria.setTipoCategoria(normalizarCategoria(categoriaActualizada.getTipoCategoria()));
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

    private boolean esCategoriaPermitida(String categoria) {
        if (categoria == null) {
            return false;
        }
        String clave = categoria.trim();
        String claveNormalizada = clave.toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");
        return CATEGORIAS_PERMITIDAS_NORMALIZADAS.contains(claveNormalizada)
            || "cuero".equals(claveNormalizada)
            || "demin".equals(claveNormalizada)
            || "de denim".equals(claveNormalizada)
            || "denim".equals(claveNormalizada)
            || "chaqueta de cuero".equals(claveNormalizada)
            || "de demin".equals(claveNormalizada);
    }

    private String normalizarCategoria(String categoria) {
        String nombre = categoria == null ? "" : categoria.trim();
        String clave = nombre.toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");

        if ("impermeables".equals(clave)) return "Impermeables";
        if ("acolchonadas".equals(clave)) return "Acolchonadas";
        if ("deportivas".equals(clave)) return "Deportivas";
        if ("cuero".equals(clave) || "chaqueta de cuero".equals(clave)) return "Cuero";
        if ("demin".equals(clave) || "de demin".equals(clave) || "de denim".equals(clave) || "denim".equals(clave)) return "Demin";

        throw new IllegalArgumentException("La categoría no es válida. Solo se admiten: Impermeables, Acolchonadas, Deportivas, Cuero y Demin.");
    }
}
