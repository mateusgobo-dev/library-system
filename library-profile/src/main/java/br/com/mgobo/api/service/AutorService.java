package br.com.mgobo.api.service;

import br.com.mgobo.api.entities.Autor;
import br.com.mgobo.api.repository.AutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDateTime;

import static br.com.mgobo.api.HttpErrorsMessage.*;

@Service
@RequiredArgsConstructor
public class AutorService {
    private final AutorRepository autorRepository;

    public ResponseEntity<?> save(Autor autor) {
        try {
            autor.setCreatedAt(LocalDateTime.now());
            autor.setUpdatedAt(LocalDateTime.now());
            autor = autorRepository.save(autor);
            return ResponseEntity.created(new URI("/find/%s".formatted(autor.getId()))).body(CREATED.getMessage().formatted(autor.getNome()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AutorService[save]", e.getMessage()));
        }
    }

    public ResponseEntity<?> update(Autor autor) {
        try {
            autor.setUpdatedAt(LocalDateTime.now());
            autor = autorRepository.save(autor);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(ACCEPTED.getMessage().formatted(autor.getNome()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AutorService[update]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findAll() {
        try {
            return ResponseEntity.ok(autorRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AutorService[findAll]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findById(Long id) {
        try {
            return ResponseEntity.ok(autorRepository.findById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AutorService[findById %s]".formatted(id), e.getMessage()));
        }
    }
}
