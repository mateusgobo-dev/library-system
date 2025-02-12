package br.com.mgobo.api.unit;

import br.com.mgobo.api.entities.Autor;
import br.com.mgobo.api.repository.AutorRepository;
import br.com.mgobo.api.service.AutorService;
import br.com.mgobo.web.dto.AutorDto;
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

public class AutorServiceTest {

    @Mock
    private AutorRepository autorRepository;
    private AutorService autorService;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.autorService = new AutorService(autorRepository);
    }

    @Test
    public void testSave() {
        Autor autor = new Autor();
        autor.setNome("JOSÉ DE ALENCAR");
        when(autorRepository.save(autor)).thenReturn(autor);

        ResponseEntity<?> autorAction = this.autorService.save(autor);
        try{
            Assertions.assertEquals(HttpStatus.CREATED, autorAction.getStatusCode(), "Autor criado com sucesso");
            LoggerFactory.getLogger(AutorServiceTest.class).info("Autor criado com sucesso");
        }catch (Exception e){
            Assertions.fail("Erro ao criar autor, error: " + e.getMessage());
        }finally {
            verify(autorRepository, times(1)).save(autor);
        }
    }

    @Test
    public void testUpdate() {
        Autor autor = new Autor();
        autor.setId(1L);
        autor.setNome("MACHADO DE ASSIS");
        when(autorRepository.save(autor)).thenReturn(autor);

        ResponseEntity<?> autorAction = this.autorService.update(autor);
        try{
            Assertions.assertEquals(HttpStatus.ACCEPTED, autorAction.getStatusCode(), "Autor alterado com sucesso");
            LoggerFactory.getLogger(AutorServiceTest.class).info("Autor alterado com sucesso");
        }catch (Exception e){
            Assertions.fail("Erro ao alterar autor, error: " + e.getMessage());
        }finally {
            verify(autorRepository, times(1)).save(autor);
        }
    }

    @Test
    public void testDelete() {
        Long id = 1L;
        doNothing().when(autorRepository).deleteById(id);
        ResponseEntity<?> autorAction = this.autorService.delete(id);
        try{
            Assertions.assertEquals(HttpStatus.MOVED_PERMANENTLY, autorAction.getStatusCode(), "Autor removido com sucesso");
            LoggerFactory.getLogger(AutorServiceTest.class).info("Autor removido com sucesso");
        }catch (Exception e){
            Assertions.fail("Erro ao remover autor, error: " + e.getMessage());
        }finally {
            verify(autorRepository, times(1)).deleteById(1L);
        }
    }

    @Test
    public void testFindAll() {
        List<Autor> autors = List.of(AutorMapper.INSTANCE.toEntity(new AutorDto(1L, "JOSÉ DE ALENCAR")),
                AutorMapper.INSTANCE.toEntity(new AutorDto(2L, "MACHADO DE ASSIS")));
        when(autorRepository.findAll()).thenReturn(autors);
        ResponseEntity<?> autorAction = this.autorService.findAll();
        try{
            LoggerFactory.getLogger(AutorServiceTest.class).info(autorAction.getBody().toString());
            Assertions.assertEquals(HttpStatus.OK, autorAction.getStatusCode(), "Autores consultados com sucesso");
        }catch (Exception e){
            Assertions.fail("Erro ao consultar autores, error: " + e.getMessage());
        }finally {
            verify(autorRepository, times(1)).findAll();
        }
    }

    @Test
    public void testFindById() {
        List<Autor> autors = List.of(AutorMapper.INSTANCE.toEntity(new AutorDto(1L, "JOSÉ DE ALENCAR")),
                AutorMapper.INSTANCE.toEntity(new AutorDto(2L, "MACHADO DE ASSIS")));
        when(autorRepository.findById(1L)).thenReturn(Optional.of(autors.get(0)));
        ResponseEntity<?> autorAction = this.autorService.findById(1L);
        try{
            LoggerFactory.getLogger(AutorServiceTest.class).info(autorAction.getBody().toString());
            Assertions.assertEquals(HttpStatus.OK, autorAction.getStatusCode(), "Autores consultados com sucesso");
        }catch (Exception e){
            Assertions.fail("Erro ao consultar autores, error: " + e.getMessage());
        }finally {
            verify(autorRepository, times(1)).findById(1L);
        }
    }
}
