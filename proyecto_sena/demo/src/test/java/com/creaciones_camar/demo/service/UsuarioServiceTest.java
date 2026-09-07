package com.creaciones_camar.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import com.creaciones_camar.demo.model.Usuario;
import com.creaciones_camar.demo.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void crearUsuario_debeAsignarRolCliente() {
        Usuario usuario = new Usuario();
        usuario.setNombres("Ana");
        usuario.setApellidos("Pérez");
        usuario.setEmail("ana@correo.com");
        usuario.setNuip("1234567890");
        usuario.setPassword("Clave123");
        usuario.setActivo(true);

        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario guardado = invocation.getArgument(0);
            guardado.setId(10L);
            return guardado;
        });
        when(jdbcTemplate.queryForObject(
                eq("SELECT id_rol FROM roles WHERE nombre = ?"),
                eq(Integer.class),
                eq("cliente")))
                .thenReturn(3);

        Usuario creado = usuarioService.crearUsuario(usuario);

        assertEquals("cliente", creado.getRol());
        verify(jdbcTemplate).update(
                eq("INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (?, ?)"),
                eq(10L),
                eq(3L));
    }

    @Test
    void crearUsuario_debeRechazarNuipInvalido() {
        Usuario usuario = new Usuario();
        usuario.setNombres("Ana");
        usuario.setApellidos("Pérez");
        usuario.setEmail("ana@correo.com");
        usuario.setNuip("ABC123");
        usuario.setPassword("ClaveSegura123");
        usuario.setActivo(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> usuarioService.crearUsuario(usuario));

        assertEquals("El NUIP debe contener solo números y tener entre 4 y 15 dígitos.", exception.getMessage());
    }
}
