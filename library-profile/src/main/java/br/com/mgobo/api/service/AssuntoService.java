package br.com.mgobo.api.service;

import br.com.mgobo.api.entities.Assunto;
import br.com.mgobo.api.repository.AssuntoRepository;
import br.com.mgobo.web.advices.HandlerError;
import jakarta.persistence.NoResultException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

import static br.com.mgobo.api.HttpErrorsMessage.*;
import static br.com.mgobo.api.parsers.ParserObject.parserObject;
import static br.com.mgobo.web.mappers.AssuntoMapper.INSTANCE;

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
            List<Assunto> assuntos = this.assuntoRepository.findAll();
            return !assuntos.isEmpty()
                    ? ResponseEntity.ok(assuntos.stream().map(INSTANCE::toDto))
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body(parserObject.toJson(List.of(HandlerError.instanceOf("404", "Sem registros de assuntos..."))));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AssuntoService[findAll]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findById(Long id) {
        try {
            return ResponseEntity.ok(INSTANCE.toDto(this.assuntoRepository.findById(id).get()));
        } catch (Exception ex) {
            if (ex.getCause() instanceof NoResultException) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(parserObject.toJson(List.of(HandlerError.instanceOf("404", "Nenhum assunto encontrado..."))));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AssuntoService[findById %s]".formatted(id), ex.getMessage()));
            }
        }
    }

    public ResponseEntity<?> delete(Long id) {
        try {
            this.assuntoRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY).body(parserObject.toJson(List.of(HandlerError.instanceOf("301", "Registro removido com sucesso"))));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(parserObject.toJson(List.of(HandlerError.instanceOf("400", (e.getMessage().toLowerCase().contains("foreign key") ? "Não é permitido excluir o assunto, ele está associado à algum livro" : "Erro na exclusão do assunto")))));
        }
    }
}
