package br.com.mgobo.api.service;

import br.com.mgobo.api.entities.Livro;
import br.com.mgobo.api.parsers.ParserObject;
import br.com.mgobo.api.repository.LivroAssuntoRepository;
import br.com.mgobo.api.repository.LivroAutorRepository;
import br.com.mgobo.api.repository.LivroRepository;
import br.com.mgobo.api.repository.LivroRepositoryImpl;
import br.com.mgobo.web.mappers.LivroMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

import static br.com.mgobo.api.HttpErrorsMessage.*;
import static br.com.mgobo.api.parsers.ParserObject.parserObject;
import static br.com.mgobo.web.mappers.LivroMapper.*;

@Service
@RequiredArgsConstructor
public class LivroService {
    private final LivroRepository livroRepository;
    private final LivroRepositoryImpl livroRepositoryImpl;

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
            List<Livro> livros = livroRepository.findAll();
            return !livros.isEmpty() ? ResponseEntity.ok(livros.stream().map(INSTANCE::toDto))
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sem registros de livros...");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroService[findAll]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findById(Long id) {
        try {
            return ResponseEntity.ok(INSTANCE.toDto(livroRepository.findById(id).get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroService[findById %s]".formatted(id), e.getMessage()));
        }
    }
}
