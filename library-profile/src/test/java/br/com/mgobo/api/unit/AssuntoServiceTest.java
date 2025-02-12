package br.com.mgobo.api.unit;

import br.com.mgobo.api.entities.Assunto;
import br.com.mgobo.api.entities.Autor;
import br.com.mgobo.api.repository.AssuntoRepository;
import br.com.mgobo.api.service.AssuntoService;
import br.com.mgobo.api.service.AutorService;
import br.com.mgobo.web.dto.AssuntoDto;
import br.com.mgobo.web.dto.AutorDto;
import br.com.mgobo.web.mappers.AssuntoMapper;
import br.com.mgobo.web.mappers.AutorMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

public class AssuntoServiceTest {

    @Mock
    private AssuntoRepository assuntoRepository;
    private AssuntoService assuntoService;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.assuntoService = new AssuntoService(assuntoRepository);
    }

    @Test
    public void testSave() {
        Assunto assunto = new Assunto();
        assunto.setDescricao("SOLID");
        when(assuntoRepository.save(assunto)).thenReturn(assunto);

        ResponseEntity<?> autorAction = this.assuntoService.save(assunto);
        try{
            Assertions.assertEquals(HttpStatus.CREATED, autorAction.getStatusCode(), "Assunto criado com sucesso");
            LoggerFactory.getLogger(AssuntoServiceTest.class).info("Assunto criado com sucesso");
        }catch (Exception e){
            Assertions.fail("Erro ao criar assunto, error: " + e.getMessage());
        }finally {
            verify(assuntoRepository, times(1)).save(assunto);
        }
    }

    @Test
    public void testUpdate() {
        Assunto assunto = new Assunto();
        assunto.setId(1L);
        assunto.setDescricao("DESIGN PATTERNS");
        when(assuntoRepository.save(assunto)).thenReturn(assunto);

        ResponseEntity<?> autorAction = this.assuntoService.update(assunto);
        try{
            Assertions.assertEquals(HttpStatus.ACCEPTED, autorAction.getStatusCode(), "Assunto alterado com sucesso");
            LoggerFactory.getLogger(AssuntoServiceTest.class).info("Assunto alterado com sucesso");
        }catch (Exception e){
            Assertions.fail("Erro ao alterar assunto, error: " + e.getMessage());
        }finally {
            verify(assuntoRepository, times(1)).save(assunto);
        }
    }

    @Test
    public void testDelete() {
        Long id = 1L;
        doNothing().when(assuntoRepository).deleteById(id);
        ResponseEntity<?> autorAction = this.assuntoService.delete(id);
        try{
            Assertions.assertEquals(HttpStatus.MOVED_PERMANENTLY, autorAction.getStatusCode(), "Assunto removido com sucesso");
            LoggerFactory.getLogger(AssuntoServiceTest.class).info("Assunto removido com sucesso");
        }catch (Exception e){
            Assertions.fail("Erro ao remover assunto, error: " + e.getMessage());
        }finally {
            verify(assuntoRepository, times(1)).deleteById(1L);
        }
    }

    @Test
    public void testFindAll() {
        List<Assunto> assuntos = List.of(AssuntoMapper.INSTANCE.toEntity(new AssuntoDto(1L, "SOLID")),
                AssuntoMapper.INSTANCE.toEntity(new AssuntoDto(2L, "DESIGN PATTERNS")));
        when(assuntoRepository.findAll()).thenReturn(assuntos);
        ResponseEntity<?> assuntoAction = this.assuntoService.findAll();
        try{
            LoggerFactory.getLogger(AssuntoServiceTest.class).info(assuntoAction.getBody().toString());
            Assertions.assertEquals(HttpStatus.OK, assuntoAction.getStatusCode(), "Assuntos consultados com sucesso");
        }catch (Exception e){
            Assertions.fail("Erro ao consultar assuntos, error: " + e.getMessage());
        }finally {
            verify(assuntoRepository, times(1)).findAll();
        }
    }

    @Test
    public void testFindById() {
        List<Assunto> assuntos = List.of(AssuntoMapper.INSTANCE.toEntity(new AssuntoDto(1L, "SOLID")),
                AssuntoMapper.INSTANCE.toEntity(new AssuntoDto(2L, "DESIGN PATTERNS")));
        when(assuntoRepository.findById(1L)).thenReturn(Optional.of(assuntos.get(0)));
        ResponseEntity<?> assuntoAction = this.assuntoService.findById(1L);
        try{
            LoggerFactory.getLogger(AssuntoServiceTest.class).info(assuntoAction.getBody().toString());
            Assertions.assertEquals(HttpStatus.OK, assuntoAction.getStatusCode(), "Assuntos consultados com sucesso");
        }catch (Exception e){
            Assertions.fail("Erro ao consultar assuntos, error: " + e.getMessage());
        }finally {
            verify(assuntoRepository, times(1)).findById(1L);
        }
    }
}
