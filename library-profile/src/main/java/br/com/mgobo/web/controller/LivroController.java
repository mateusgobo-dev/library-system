package br.com.mgobo.web.controller;

import br.com.mgobo.api.service.LivroService;
import br.com.mgobo.web.dto.LivroDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static br.com.mgobo.web.mappers.LivroMapper.INSTANCE;

@CrossOrigin(value = "*")
@RestController
@RequestMapping("/api/v1/livros")
@RequiredArgsConstructor
public class LivroController {

    private final LivroService livroService;

    @GetMapping
    public ResponseEntity<?> findAll() {
        return livroService.findAll();
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return livroService.findById(id);
    }

    @PostMapping
    public ResponseEntity<?> save(@Valid  @RequestBody LivroDto livro) {
        return livroService.save(INSTANCE.toEntity(livro));
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody LivroDto livro) {
        return livroService.update(INSTANCE.toEntity(livro));
    }
}
