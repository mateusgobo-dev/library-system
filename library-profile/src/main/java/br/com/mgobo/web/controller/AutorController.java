package br.com.mgobo.web.controller;

import br.com.mgobo.api.service.AutorService;
import br.com.mgobo.web.dto.AutorDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static br.com.mgobo.web.mappers.AutorMapper.INSTANCE;

@CrossOrigin(value = "*")
@RestController
@RequestMapping("/api/v1/autores")
@RequiredArgsConstructor
public class AutorController {

    private final AutorService autorService;

    @GetMapping
    public ResponseEntity<?> findAll() {
        return autorService.findAll();
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return autorService.findById(id);
    }

    @PostMapping
    public ResponseEntity<?> save(@Valid @RequestBody AutorDto autorDto) {
        return autorService.save(INSTANCE.toEntity(autorDto));
    }

    @PutMapping
    public ResponseEntity<?> update(@Valid  @RequestBody AutorDto autorDto) {
        return autorService.update(INSTANCE.toEntity(autorDto));
    }
}
