package com.creaciones_camar.demo.model;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoTallaId implements Serializable {
    private Long producto;
    private Long talla;
}
