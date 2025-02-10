package br.com.mgobo.api.service;

import br.com.mgobo.api.entities.*;
import br.com.mgobo.api.repository.AssuntoRepository;
import br.com.mgobo.api.repository.AutorRepository;
import br.com.mgobo.api.repository.LivroRepository;
import br.com.mgobo.web.advices.HandlerError;
import br.com.mgobo.web.dto.LivroDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static br.com.mgobo.api.HttpErrorsMessage.*;
import static br.com.mgobo.api.parsers.ParserObject.parserObject;
import static br.com.mgobo.api.parsers.ParserObject.toJsonString;
import static br.com.mgobo.web.mappers.LivroMapper.INSTANCE;

@Service
@RequiredArgsConstructor
public class LivroService {
    private final LivroRepository livroRepository;
    private final AutorRepository autorRepository;
    private final AssuntoRepository assuntoRepository;

    private LivroAssunto livroAssunto(Livro livro, Assunto assunto) {
        LivroAssunto livroAssunto = new LivroAssunto();
        livroAssunto.setLivro(livro);
        livroAssunto.setAssunto(assunto);
        return livroAssunto;
    }

    private LivroAutor livroAutor(Livro livro, Autor autor) {
        LivroAutor livroAutor = new LivroAutor();
        livroAutor.setLivro(livro);
        livroAutor.setAutor(autor);
        return livroAutor;
    }

    public ResponseEntity<?> save(LivroDto livroDto) {
        try {
            Autor autor = this.autorRepository.findById(livroDto.autorId()).get();
            Assunto assunto = this.assuntoRepository.findById(livroDto.assuntoId()).get();

            Livro livro = INSTANCE.toEntity(livroDto);
            livro.setCreatedAt(LocalDateTime.now());
            livro.setLivroAssuntoCollection(Set.of(this.livroAssunto(livro, assunto)));
            livro.setLivroAutorCollection(Set.of(this.livroAutor(livro, autor)));
            livro = livroRepository.save(livro);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .header("baseUrl", "/find/"+livro.getId().toString()).body(
                            Map.of("response",toJsonString.apply(CREATED.getMessage().formatted(livro.getTitulo()))));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroService[save]", e.getMessage()));
        }
    }

    public ResponseEntity<?> update(LivroDto livroDto) {
        try {
            Autor autor = this.autorRepository.findById(livroDto.autorId()).get();
            Assunto assunto = this.assuntoRepository.findById(livroDto.assuntoId()).get();

            Livro livro = INSTANCE.toEntity(livroDto);
            livro.setLivroAssuntoCollection(Set.of(this.livroAssunto(livro, assunto)));
            livro.setLivroAutorCollection(Set.of(this.livroAutor(livro, autor)));
            livro.setUpdatedAt(LocalDateTime.now());

            livro = livroRepository.save(livro);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of("response",toJsonString.apply(ACCEPTED.getMessage().formatted(livro.getTitulo()))));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroService[update]", e.getMessage()));
        }
    }

    @Transactional
    public ResponseEntity<?> findAll() {
        try {
            List<Livro> livros = livroRepository.findAll();
            List<LivroDto> collectionDto = livros.stream().map(livro -> new LivroDto(livro.getId(),livro.getTitulo(), livro.getEditora(), livro.getEdicao().toString(), livro.getAnoPublicacao(),
                    (livro.getLivroAssuntoCollection().stream().map(livroAssunto -> livroAssunto.getAssunto().getId()).findFirst().orElse(null)),
                    (livro.getLivroAssuntoCollection().stream().map(livroAssunto -> livroAssunto.getAssunto().getDescricao()).findFirst().orElse(null)),
                    (livro.getLivroAutorCollection().stream().map(livroAutor -> livroAutor.getAutor().getId()).findFirst().orElse(null)),
                    (livro.getLivroAutorCollection().stream().map(livroAutor -> livroAutor.getAutor().getNome()).findFirst()).orElse(null))).toList();

            return !livros.isEmpty() ? ResponseEntity.ok(collectionDto)
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body(parserObject.toJson(List.of(HandlerError.instanceOf("404", "Sem registros de livros"))));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroService[findAll]", e.getMessage()));
        }
    }

    @Transactional
    public ResponseEntity<?> findById(Long id) {
        try {
            Livro livro = livroRepository.findById(id).get();
            LivroDto livroDto = new LivroDto(livro.getId(),livro.getTitulo(), livro.getEditora(), livro.getEdicao().toString(), livro.getAnoPublicacao(),
                    (livro.getLivroAssuntoCollection().stream().map(livroAssunto -> livroAssunto.getAssunto().getId()).findFirst().orElse(null)),
                    (livro.getLivroAssuntoCollection().stream().map(livroAssunto -> livroAssunto.getAssunto().getDescricao()).findFirst().orElse(null)),
                    (livro.getLivroAutorCollection().stream().map(livroAutor -> livroAutor.getAutor().getId()).findFirst().orElse(null)),
                    (livro.getLivroAutorCollection().stream().map(livroAutor -> livroAutor.getAutor().getNome()).findFirst()).orElse(null));
            return ResponseEntity.ok(livroDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BAD_REQUEST.getMessage().formatted("LivroService[findById%s]".formatted(id), e.getMessage()));
        }
    }
}
