package com.creaciones_camar.demo.controller;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.creaciones_camar.demo.model.Talla;
import com.creaciones_camar.demo.repository.TallaRepository;

@RestController
@RequestMapping("/api/tallas")
@CrossOrigin(origins = "*")
public class TallaController {
    private final TallaRepository tallaRepository;

    public TallaController(TallaRepository tallaRepository) {
        this.tallaRepository = tallaRepository;
    }

    @GetMapping
    public List<Talla> obtenerTodas() {
        return tallaRepository.findAll().stream()
            .sorted(Comparator.comparingInt((Talla talla) -> {
                String nombre = talla.getNombre() == null ? "" : talla.getNombre().trim();
                return switch (nombre.toUpperCase(Locale.ROOT)) {
                    case "XS" -> 0;
                    case "S" -> 1;
                    case "M" -> 2;
                    case "L" -> 3;
                    case "XL" -> 4;
                    case "UNICA", "ÚNICA" -> 5;
                    default -> 99;
                };
            }).thenComparing(talla -> talla.getNombre() == null ? "" : talla.getNombre()))
            .toList();
    }
}