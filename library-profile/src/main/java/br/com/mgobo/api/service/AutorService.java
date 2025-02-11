package br.com.mgobo.api.service;

import br.com.mgobo.api.entities.Autor;
import br.com.mgobo.api.repository.AutorRepository;
import br.com.mgobo.api.repository.AutorRepositoryImpl;
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
import static br.com.mgobo.web.mappers.AutorMapper.INSTANCE;

@Service
@RequiredArgsConstructor
public class AutorService {
    private final AutorRepository autorRepository;
    private final AutorRepositoryImpl autorRepositoryImpl;

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
            List<Autor> autores = autorRepository.findAll();
            return !autores.isEmpty() ? ResponseEntity.ok(autores.stream().map(INSTANCE::toDto))
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body(parserObject.toJson(List.of(HandlerError.instanceOf("404", "Sem registros de autores"))));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AutorService[findAll]", e.getMessage()));
        }
    }

    public ResponseEntity<?> findById(Long id) {
        try {
            return ResponseEntity.ok(INSTANCE.toDto(this.autorRepository.findById(id).get()));
        } catch (Exception ex) {
            if (ex.getCause() instanceof NoResultException) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(parserObject.toJson(List.of(HandlerError.instanceOf("404", "Nenhum assunto encontrado"))));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("AutorService[findById %s]".formatted(id), ex.getMessage()));
            }
        }
    }

    public ResponseEntity<?> delete(Long id) {
        try {
            this.autorRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY).body(parserObject.toJson(List.of(HandlerError.instanceOf("301", "Registro removido com sucesso"))));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(parserObject.toJson(List.of(HandlerError.instanceOf("400", (e.getMessage().toLowerCase().contains("foreign key") ? "Não é permitido excluir o autor, ele está associado à algum livro" : "Erro na exclusão do autor")))));
        }
    }
}
