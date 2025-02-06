package br.com.mgobo.api.service;

import br.com.mgobo.api.entities.Livro;
import br.com.mgobo.api.parsers.ParserObject;
import br.com.mgobo.api.repository.LivroAssuntoRepository;
import br.com.mgobo.api.repository.LivroAutorRepository;
import br.com.mgobo.api.repository.LivroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDateTime;

import static br.com.mgobo.api.HttpErrorsMessage.*;
import static br.com.mgobo.api.parsers.ParserObject.parserObject;

@Service
@RequiredArgsConstructor
public class LivroService {
    private final LivroRepository livroRepository;
    private final LivroAssuntoRepository livroAssuntoRepository;
    private final LivroAutorRepository livroAutorRepository;

    public ResponseEntity<?> save(Livro livro) {
        try {
            livro.setCreatedAt(LocalDateTime.now());
            livro.setUpdatedAt(LocalDateTime.now());
            livro = livroRepository.save(livro);
            return ResponseEntity.created(new URI("/find/%s".formatted(livro.getId()))).body(CREATED.getMessage().formatted(livro.getTitulo()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroService[save]", e.getMessage()));
        }
    }

    public ResponseEntity<?> update(Livro livro) {
        try {
            livro.setUpdatedAt(LocalDateTime.now());
            livro = livroRepository.save(livro);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(ACCEPTED.getMessage().formatted(livro.getTitulo()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroService[update]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findAll() {
        try {
            return ResponseEntity.ok(parserObject.toJson(livroRepository.findAll()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroService[findAll]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findById(Long id) {
        try {
            return ResponseEntity.ok(parserObject.toJson(livroRepository.findById(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroService[findById %s]".formatted(id), e.getMessage()));
        }
    }
}
