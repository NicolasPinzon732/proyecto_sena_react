package com.creaciones_camar.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.creaciones_camar.demo.model.Usuario;
import com.creaciones_camar.demo.repository.UsuarioRepository;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // CREATE
    public Usuario crearUsuario(Usuario usuario) {
        validarUsuario(usuario, true);

        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("cliente");
        }

        Usuario guardado = usuarioRepository.save(usuario);

        String rol = guardado.getRol() == null ? "cliente" : guardado.getRol().trim().toLowerCase();
        Integer rolId = jdbcTemplate.queryForObject(
                "SELECT id_rol FROM roles WHERE nombre = ?",
                Integer.class,
                rol
        );

        if (rolId != null && guardado.getId() != null) {
            jdbcTemplate.update(
                    "INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (?, ?)",
                    guardado.getId(),
                    rolId.longValue()
            );
        }

        return guardado;
    }

    // READ
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> obtenerPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public String obtenerRolPorUsuario(Long usuarioId) {
        if (usuarioId == null) {
            return "cliente";
        }

        String rol = jdbcTemplate.query(
                "SELECT r.nombre FROM usuario_roles ur JOIN roles r ON r.id_rol = ur.rol_id WHERE ur.usuario_id = ? ORDER BY r.id_rol LIMIT 1",
                ps -> ps.setLong(1, usuarioId),
                rs -> rs.next() ? rs.getString("nombre") : "cliente"
        );

        return rol == null || rol.isBlank() ? "cliente" : rol.trim().toLowerCase();
    }

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> obtenerPorRol(String rol) {
        return usuarioRepository.findAll().stream()
                .filter(usuario -> {
                    String rolUsuario = obtenerRolPorUsuario(usuario.getId());
                    return rol.equalsIgnoreCase(rolUsuario == null ? "" : rolUsuario);
                })
                .toList();
    }

    public List<Usuario> obtenerActivos() {
        return usuarioRepository.findAll().stream()
                .filter(usuario -> usuario.getActivo() == null || usuario.getActivo())
                .toList();
    }

    public Optional<Usuario> autenticar(String email, String password) {
        return usuarioRepository.findByEmail(email)
                .filter(usuario -> usuario.getActivo() != null && usuario.getActivo())
                .filter(usuario -> usuario.getPassword() != null && usuario.getPassword().equals(password));
    }

    // UPDATE
    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        Optional<Usuario> existente = usuarioRepository.findById(id);
        if (existente.isPresent()) {
            Usuario usuario = existente.get();
            if (usuarioActualizado.getNuip() != null) {
                usuario.setNuip(usuarioActualizado.getNuip());
            }
            if (usuarioActualizado.getNombres() != null) usuario.setNombres(usuarioActualizado.getNombres());
            if (usuarioActualizado.getApellidos() != null) usuario.setApellidos(usuarioActualizado.getApellidos());
            if (usuarioActualizado.getEmail() != null) usuario.setEmail(usuarioActualizado.getEmail());
            if (usuarioActualizado.getTelefono() != null) usuario.setTelefono(usuarioActualizado.getTelefono());
            if (usuarioActualizado.getPassword() != null) usuario.setPassword(usuarioActualizado.getPassword());
            if (usuarioActualizado.getRol() != null) usuario.setRol(usuarioActualizado.getRol());
            validarUsuario(usuario, usuarioActualizado.getPassword() != null);
            return usuarioRepository.save(usuario);
        }
        return null;
    }

    private void validarUsuario(Usuario usuario, boolean validarPassword) {
        if (usuario == null) {
            throw new IllegalArgumentException("El usuario no puede ser nulo.");
        }

        if (usuario.getNombres() == null || !usuario.getNombres().trim().matches("[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{2,100}")) {
            throw new IllegalArgumentException("Los nombres son obligatorios.");
        }

        if (usuario.getApellidos() == null || !usuario.getApellidos().trim().matches("[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{2,100}")) {
            throw new IllegalArgumentException("Los apellidos son obligatorios.");
        }

        if (usuario.getEmail() == null || !usuario.getEmail().trim().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("Ingresa un correo válido.");
        }

        if (usuario.getNuip() == null || !usuario.getNuip().trim().matches("\\d{6,15}")) {
            throw new IllegalArgumentException("El NUIP debe contener solo números y tener entre 6 y 15 dígitos.");
        }

        if (validarPassword && (usuario.getPassword() == null || !usuario.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))) {
            throw new IllegalArgumentException("La contraseña debe tener mínimo 8 caracteres e incluir mayúscula, minúscula y número.");
        }

        if (usuario.getTelefono() != null && !usuario.getTelefono().trim().matches("\\d{7,15}")) {
            throw new IllegalArgumentException("El teléfono debe contener solo números y tener mínimo 7 dígitos.");
        }

        usuario.setNuip(usuario.getNuip().trim());
        usuario.setNombres(usuario.getNombres().trim());
        usuario.setApellidos(usuario.getApellidos().trim());
        usuario.setEmail(usuario.getEmail().trim().toLowerCase());
        if (usuario.getTelefono() != null) {
            usuario.setTelefono(usuario.getTelefono().trim());
        }
    }

    // DELETE
    public boolean eliminarUsuario(Long id) {
        Optional<Usuario> existente = usuarioRepository.findById(id);
        if (existente.isPresent()) {
            Usuario usuario = existente.get();
            usuario.setActivo(false);
            usuarioRepository.save(usuario);
            return true;
        }
        return false;
    }

    public void desactivarUsuario(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        usuario.ifPresent(u -> {
            u.setActivo(false);
            usuarioRepository.save(u);
        });
    }

    public void activarUsuario(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        usuario.ifPresent(u -> {
            u.setActivo(true);
            usuarioRepository.save(u);
        });
    }
}
