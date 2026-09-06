package com.creaciones_camar.demo.model;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario", nullable = false, unique = true)
    private Long id;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "email", unique = true, nullable = false, length = 150)
    private String email;

    @Column(name = "nuip", unique = true, nullable = false, length = 15)
    private String nuip;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

        @ManyToOne
        @JoinColumn(name = "tipo_documento_id")
        private TipoDocumento tipoDocumento;

        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(name = "usuario_roles",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id"))
        private Set<Rol> roles;

    @Transient
    private String idUsuario;

    @Transient
    private String rol = "cliente";

    @PrePersist
    protected void onCreate() {
        if (nuip != null) {
            nuip = nuip.replace(" ", "").trim();
        }
        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
        if (activo == null) {
            activo = true;
        }
        if (rol == null || rol.isBlank()) {
            rol = "cliente";
        }
        if (idUsuario == null || idUsuario.isBlank()) {
            idUsuario = "USR-" + id;
        }
    }
}
