package com.creaciones_camar.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.creaciones_camar.demo.model.Categoria;
import com.creaciones_camar.demo.repository.CategoriaRepository;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private CategoriaService categoriaService;

    @Test
    void crearCategoria_debeNormalizarCueroComoCuero() {
        Categoria categoria = new Categoria();
        categoria.setTipoCategoria("cuero");
        categoria.setActivo(true);

        when(categoriaRepository.save(any(Categoria.class))).thenAnswer(invocation -> {
            Categoria guardada = invocation.getArgument(0);
            return guardada;
        });

        Categoria creada = assertDoesNotThrow(() -> categoriaService.crearCategoria(categoria));

        assertEquals("Cuero", creada.getTipoCategoria());
    }

    @Test
    void obtenerTodas_debeIncluirCategoriasLegacyComoCueroODemin() {
        Categoria categoriaCuero = new Categoria();
        categoriaCuero.setId(1L);
        categoriaCuero.setTipoCategoria("cuero");
        categoriaCuero.setActivo(true);

        Categoria categoriaDemin = new Categoria();
        categoriaDemin.setId(2L);
        categoriaDemin.setTipoCategoria("demin");
        categoriaDemin.setActivo(true);

        when(categoriaRepository.findAll()).thenReturn(List.of(categoriaCuero, categoriaDemin));

        List<Categoria> categorias = categoriaService.obtenerTodas();

        assertEquals(2, categorias.size());
        assertTrue(categorias.stream().anyMatch(c -> "Cuero".equalsIgnoreCase(c.getTipoCategoria())));
        assertTrue(categorias.stream().anyMatch(c -> "Demin".equalsIgnoreCase(c.getTipoCategoria())));
    }
}
