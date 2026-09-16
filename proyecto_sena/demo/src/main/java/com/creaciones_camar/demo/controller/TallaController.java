package com.creaciones_camar.demo.controller;

import java.util.List;

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
        return tallaRepository.findAll();
    }
}