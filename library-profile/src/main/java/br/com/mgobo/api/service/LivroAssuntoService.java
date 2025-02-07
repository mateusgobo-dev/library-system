package br.com.mgobo.api.service;

import br.com.mgobo.api.entities.LivroAssunto;
import br.com.mgobo.api.repository.LivroAssuntoRepository;
import br.com.mgobo.api.repository.LivroAssuntoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDateTime;

import static br.com.mgobo.api.HttpErrorsMessage.*;

@Service
@RequiredArgsConstructor
public class LivroAssuntoService {
    private final LivroAssuntoRepository livroAssuntoRepository;

    public ResponseEntity<?> save(LivroAssunto livroAssunto) {
        try {
            livroAssunto.setCreatedAt(LocalDateTime.now());
            livroAssunto.setUpdatedAt(LocalDateTime.now());
            livroAssunto = livroAssuntoRepository.save(livroAssunto);
            return ResponseEntity.created(new URI("/find/%s".formatted(livroAssunto.getId()))).body(CREATED.getMessage().formatted(livroAssunto.getAssunto().getDescricao() + " x" + livroAssunto.getLivro().getTitulo()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroAssuntoService[save]", e.getMessage()));
        }
    }

    public ResponseEntity<?> update(LivroAssunto livroAssunto) {
        try {
            livroAssunto.setUpdatedAt(LocalDateTime.now());
            livroAssunto = livroAssuntoRepository.save(livroAssunto);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(ACCEPTED.getMessage().formatted(livroAssunto.getAssunto().getDescricao() + " x" + livroAssunto.getLivro().getTitulo()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroAssuntoService[update]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findAll() {
        try {
            return ResponseEntity.ok(livroAssuntoRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroAssuntoService[findAll]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findById(Long id) {
        try {
            return ResponseEntity.ok(livroAssuntoRepository.findById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroAssuntoService[findById %s]".formatted(id), e.getMessage()));
        }
    }
}
