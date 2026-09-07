package com.creaciones_camar.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.creaciones_camar.demo.model.Usuario;
import com.creaciones_camar.demo.repository.TipoDocumentoRepository;
import com.creaciones_camar.demo.repository.UsuarioRepository;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private TipoDocumentoRepository tipoDocumentoRepository;

    // CREATE
    public Usuario crearUsuario(Usuario usuario) {
        resolverTipoDocumento(usuario);
        validarUsuario(usuario, true);
        validarUnicidad(usuario, null);

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
        return usuarioRepository.findById(id).map(this::cargarRolPersistido);
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
        return usuarioRepository.findAll().stream()
            .map(this::cargarRolPersistido)
            .toList();
    }

    public List<Usuario> obtenerPorRol(String rol) {
        return usuarioRepository.findAll().stream()
                .map(this::cargarRolPersistido)
                .filter(usuario -> rol.equalsIgnoreCase(usuario.getRol()))
                .toList();
    }

    public List<Usuario> obtenerActivos() {
        return usuarioRepository.findAll().stream()
                .filter(usuario -> usuario.getActivo() == null || usuario.getActivo())
                .map(this::cargarRolPersistido)
                .toList();
    }

    public List<Usuario> obtenerInactivos() {
        return usuarioRepository.findAll().stream()
                .filter(usuario -> Boolean.FALSE.equals(usuario.getActivo()))
                .map(this::cargarRolPersistido)
                .toList();
    }

    private Usuario cargarRolPersistido(Usuario usuario) {
        usuario.setRol(obtenerRolPorUsuario(usuario.getId()));
        return usuario;
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
            if (usuarioActualizado.getTipoDocumento() != null) {
                Long tipoId = usuarioActualizado.getTipoDocumento().getIdTipo();
                if (tipoId == null) {
                    throw new IllegalArgumentException("El tipo de documento seleccionado no es válido.");
                }
                usuario.setTipoDocumento(tipoDocumentoRepository.findById(tipoId)
                        .orElseThrow(() -> new IllegalArgumentException("El tipo de documento no existe.")));
            }
            String rolSolicitado = usuarioActualizado.getRol();
            if (rolSolicitado != null) {
                rolSolicitado = rolSolicitado.trim().toLowerCase();
                if (!List.of("cliente", "empleado", "admin").contains(rolSolicitado)) {
                    throw new IllegalArgumentException("El rol seleccionado no es válido.");
                }
                usuario.setRol(rolSolicitado);
            }
            validarUnicidad(usuario, id);
            validarUsuario(usuario, usuarioActualizado.getPassword() != null);
            Usuario guardado = usuarioRepository.save(usuario);
            if (rolSolicitado != null) {
                Integer rolId = jdbcTemplate.queryForObject("SELECT id_rol FROM roles WHERE nombre = ?", Integer.class, rolSolicitado);
                jdbcTemplate.update("DELETE FROM usuario_roles WHERE usuario_id = ?", guardado.getId());
                jdbcTemplate.update("INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (?, ?)", guardado.getId(), rolId.longValue());
            }
            return guardado;
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

        if (usuario.getNuip() == null || !usuario.getNuip().trim().matches("\\d{4,15}")) {
            throw new IllegalArgumentException("El NUIP debe contener solo números y tener entre 4 y 15 dígitos.");
        }

        if (validarPassword && (usuario.getPassword() == null || !usuario.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))) {
            throw new IllegalArgumentException("La contraseña debe tener mínimo 8 caracteres e incluir mayúscula, minúscula y número.");
        }

        if (usuario.getTelefono() != null && !usuario.getTelefono().trim().isEmpty()
                && !usuario.getTelefono().trim().matches("\\+?\\d{7,15}")) {
            throw new IllegalArgumentException("El teléfono debe contener entre 7 y 15 dígitos y puede incluir el prefijo +.");
        }

        usuario.setNuip(usuario.getNuip().trim());
        usuario.setNombres(usuario.getNombres().trim());
        usuario.setApellidos(usuario.getApellidos().trim());
        usuario.setEmail(usuario.getEmail().trim().toLowerCase());
        if (usuario.getTelefono() != null) {
            String telefono = usuario.getTelefono().trim();
            usuario.setTelefono(telefono.isEmpty() ? null : telefono);
        }
    }

    private void validarUnicidad(Usuario usuario, Long idActual) {
        usuarioRepository.findByNuip(usuario.getNuip().trim()).ifPresent(otro -> {
            if (!otro.getId().equals(idActual)) {
                throw new IllegalArgumentException("El NUIP ya está registrado.");
            }
        });
        usuarioRepository.findByEmail(usuario.getEmail().trim().toLowerCase()).ifPresent(otro -> {
            if (!otro.getId().equals(idActual)) {
                throw new IllegalArgumentException("El correo ya está registrado.");
            }
        });
    }

    private void resolverTipoDocumento(Usuario usuario) {
        if (usuario == null || usuario.getTipoDocumento() == null) {
            return;
        }
        Long tipoId = usuario.getTipoDocumento().getIdTipo();
        if (tipoId == null) {
            throw new IllegalArgumentException("El tipo de documento seleccionado no es válido.");
        }
        usuario.setTipoDocumento(tipoDocumentoRepository.findById(tipoId)
                .orElseThrow(() -> new IllegalArgumentException("El tipo de documento no existe.")));
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
