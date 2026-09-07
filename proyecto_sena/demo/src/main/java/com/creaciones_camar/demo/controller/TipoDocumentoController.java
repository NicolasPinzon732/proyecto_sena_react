package com.creaciones_camar.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.creaciones_camar.demo.model.TipoDocumento;
import com.creaciones_camar.demo.repository.TipoDocumentoRepository;

@RestController
@RequestMapping("/api/tipo-documentos")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:4173"})
public class TipoDocumentoController {
    @Autowired
    private TipoDocumentoRepository tipoDocumentoRepository;

    @GetMapping
    public List<TipoDocumento> obtenerTodos() {
        return tipoDocumentoRepository.findAll();
    }
}
