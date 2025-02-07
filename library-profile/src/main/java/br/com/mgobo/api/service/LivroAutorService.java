package br.com.mgobo.api.service;

import br.com.mgobo.api.entities.LivroAutor;
import br.com.mgobo.api.repository.LivroAutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDateTime;

import static br.com.mgobo.api.HttpErrorsMessage.*;

@Service
@RequiredArgsConstructor
public class LivroAutorService {
    private final LivroAutorRepository livroAutorRepository;

    public ResponseEntity<?> save(LivroAutor livroAutor) {
        try {
            livroAutor.setCreatedAt(LocalDateTime.now());
            livroAutor.setUpdatedAt(LocalDateTime.now());
            livroAutor = livroAutorRepository.save(livroAutor);
            return ResponseEntity.created(new URI("/find/%s".formatted(livroAutor.getId()))).body(CREATED.getMessage().formatted(livroAutor.getAutor().getNome() + " x" + livroAutor.getLivro().getTitulo()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroAutorService[save]", e.getMessage()));
        }
    }

    public ResponseEntity<?> update(LivroAutor livroAutor) {
        try {
            livroAutor.setUpdatedAt(LocalDateTime.now());
            livroAutor = livroAutorRepository.save(livroAutor);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(ACCEPTED.getMessage().formatted(livroAutor.getAutor().getNome() + " x" + livroAutor.getLivro().getTitulo()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroAutorService[update]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findAll() {
        try {
            return ResponseEntity.ok(livroAutorRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroAutorService[findAll]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findById(Long id) {
        try {
            return ResponseEntity.ok(livroAutorRepository.findById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroAutorService[findById %s]".formatted(id), e.getMessage()));
        }
    }
}
