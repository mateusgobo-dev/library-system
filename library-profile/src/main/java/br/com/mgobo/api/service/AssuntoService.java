package br.com.mgobo.api.service;

import br.com.mgobo.api.entities.Assunto;
import br.com.mgobo.api.parsers.ParserObject;
import br.com.mgobo.api.repository.AssuntoRepository;
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
public class AssuntoService {
    private final AssuntoRepository assuntoRepository;

    public ResponseEntity<?> save(Assunto assunto) {
        try {
            assunto.setCreatedAt(LocalDateTime.now());
            assunto.setUpdatedAt(LocalDateTime.now());
            assunto = assuntoRepository.save(assunto);
            return ResponseEntity.created(new URI("/find/%s".formatted(assunto.getId()))).body(CREATED.getMessage().formatted(assunto.getDescricao()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AssuntoService[save]", e.getMessage()));
        }
    }

    public ResponseEntity<?> update(Assunto assunto) {
        try {
            assunto.setUpdatedAt(LocalDateTime.now());
            assunto = assuntoRepository.save(assunto);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(ACCEPTED.getMessage().formatted(assunto.getDescricao()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AssuntoService[update]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findAll() {
        try {
            return ResponseEntity.ok(parserObject.toJson(assuntoRepository.findAll()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AssuntoService[findAll]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findById(Long id) {
        try {
            return ResponseEntity.ok(parserObject.toJson(assuntoRepository.findById(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AssuntoService[findById %s]".formatted(id), e.getMessage()));
        }
    }
}
