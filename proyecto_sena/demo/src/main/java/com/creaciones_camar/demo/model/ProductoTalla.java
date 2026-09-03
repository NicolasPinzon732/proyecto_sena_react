package com.creaciones_camar.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "producto_tallas")
@IdClass(ProductoTallaId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoTalla {
    @Id
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Id
    @ManyToOne
    @JoinColumn(name = "talla_id", nullable = false)
    private Talla talla;

    @Column(nullable = false)
    private Integer cantidad = 0;
}
