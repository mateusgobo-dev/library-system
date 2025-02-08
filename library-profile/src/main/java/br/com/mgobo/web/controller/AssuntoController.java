package br.com.mgobo.web.controller;

import br.com.mgobo.api.service.AssuntoService;
import br.com.mgobo.web.dto.AssuntoDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static br.com.mgobo.web.mappers.AssuntoMapper.INSTANCE;

@CrossOrigin(value = "*")
@RestController
@RequestMapping("/api/v1/assuntos")
@RequiredArgsConstructor
public class AssuntoController {

    private final AssuntoService assuntoService;

    @GetMapping
    public ResponseEntity<?> findAll() {
        return assuntoService.findAll();
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return assuntoService.findById(id);
    }

    @PostMapping
    public ResponseEntity<?> save(@Valid @RequestBody AssuntoDto assuntoDto) {
        return assuntoService.save(INSTANCE.toEntity(assuntoDto));
    }

    @PutMapping
    public ResponseEntity<?> update(@Valid @RequestBody AssuntoDto assuntoDto) {
        return assuntoService.update(INSTANCE.toEntity(assuntoDto));
    }
}
