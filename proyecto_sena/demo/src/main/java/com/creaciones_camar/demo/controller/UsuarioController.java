package com.creaciones_camar.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.creaciones_camar.demo.model.Usuario;
import com.creaciones_camar.demo.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:4173"})
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.crearUsuario(usuario);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registrarUsuario(@RequestBody Map<String, Object> payload) {
        String nombres = obtenerTexto(payload, "nombres", "p_nom_usuario");
        String apellidos = obtenerTexto(payload, "apellidos", "p_ape_usuario");
        String email = obtenerTexto(payload, "email", "correo");
        String telefono = obtenerTexto(payload, "telefono");
        String password = obtenerTexto(payload, "password");

        if (nombres == null || apellidos == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Faltan datos obligatorios para el registro."));
        }

        String emailNormalizado = email.trim().toLowerCase(Locale.ROOT);
        if (usuarioService.obtenerPorEmail(emailNormalizado).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "El correo ya está registrado."));
        }

        Usuario usuario = new Usuario();
        usuario.setNombres(nombres.trim());
        usuario.setApellidos(apellidos.trim());
        usuario.setEmail(emailNormalizado);
        usuario.setTelefono(telefono == null ? "" : telefono.trim());
        usuario.setPassword(password);
        usuario.setRol("cliente");
        usuario.setActivo(true);

        Usuario nuevoUsuario = usuarioService.crearUsuario(usuario);
        nuevoUsuario.setRol(usuarioService.obtenerRolPorUsuario(nuevoUsuario.getId()));
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("user", devolverUsuarioPublico(nuevoUsuario));
        respuesta.put("token", "token-" + nuevoUsuario.getId() + "-" + System.currentTimeMillis());
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        String correoAlternativo = payload.get("correo");
        String passwordAlternativo = payload.get("contraseña");

        String emailFinal = (email != null ? email : correoAlternativo);
        String passwordFinal = (password != null ? password : passwordAlternativo);

        if (emailFinal == null || passwordFinal == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email y contraseña son obligatorios."));
        }

        Optional<Usuario> usuarioOpt = usuarioService.autenticar(emailFinal.trim().toLowerCase(Locale.ROOT), passwordFinal);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales inválidas."));
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setRol(usuarioService.obtenerRolPorUsuario(usuario.getId()));
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("user", devolverUsuarioPublico(usuario));
        respuesta.put("token", "token-" + usuario.getId() + "-" + System.currentTimeMillis());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        List<Usuario> usuarios = usuarioService.obtenerTodos();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.obtenerPorId(id);
        return usuario.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> obtenerPorEmail(@PathVariable String email) {
        Optional<Usuario> usuario = usuarioService.obtenerPorEmail(email);
        return usuario.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/rol/{rol}")
    public ResponseEntity<List<Usuario>> obtenerPorRol(@PathVariable String rol) {
        List<Usuario> usuarios = usuarioService.obtenerPorRol(rol);
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Usuario>> obtenerActivos() {
        List<Usuario> usuarios = usuarioService.obtenerActivos();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
        Usuario usuarioActual = usuarioService.actualizarUsuario(id, usuarioActualizado);
        if (usuarioActual != null) {
            return new ResponseEntity<>(usuarioActual, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        if (usuarioService.eliminarUsuario(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/activar")
    public ResponseEntity<Void> activarUsuario(@PathVariable Long id) {
        usuarioService.activarUsuario(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivarUsuario(@PathVariable Long id) {
        usuarioService.desactivarUsuario(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private String obtenerTexto(Map<String, Object> payload, String... claves) {
        for (String clave : claves) {
            Object valor = payload.get(clave);
            if (valor != null && !String.valueOf(valor).trim().isEmpty()) {
                return String.valueOf(valor);
            }
        }
        return null;
    }

    private Map<String, Object> devolverUsuarioPublico(Usuario usuario) {
        String rol = usuario.getRol();
        if (rol == null || rol.isBlank()) {
            rol = usuarioService.obtenerRolPorUsuario(usuario.getId());
        }

        Map<String, Object> publico = new HashMap<>();
        publico.put("id", usuario.getId());
        publico.put("idUsuario", usuario.getIdUsuario());
        publico.put("nombres", usuario.getNombres());
        publico.put("apellidos", usuario.getApellidos());
        publico.put("email", usuario.getEmail());
        publico.put("telefono", usuario.getTelefono());
        publico.put("rol", rol);
        publico.put("activo", usuario.getActivo());
        return publico;
    }
}
