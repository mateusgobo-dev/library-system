package br.com.mgobo.web.controller;

import br.com.mgobo.api.entities.Assunto;
import br.com.mgobo.api.entities.Autor;
import br.com.mgobo.api.entities.Livro;
import br.com.mgobo.api.repository.AssuntoRepository;
import br.com.mgobo.api.repository.AutorRepository;
import br.com.mgobo.api.repository.LivroRepository;
import br.com.mgobo.web.BaseIntegratedTest;
import br.com.mgobo.web.dto.AssuntoDto;
import br.com.mgobo.web.dto.AutorDto;
import br.com.mgobo.web.dto.LivroDto;
import br.com.mgobo.web.mappers.AssuntoMapper;
import br.com.mgobo.web.mappers.AutorMapper;
import br.com.mgobo.web.mappers.LivroMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static br.com.mgobo.api.parsers.ParserObject.parserObject;
import static br.com.mgobo.web.mappers.LivroMapper.INSTANCE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class LivroControllerTest extends BaseIntegratedTest {

    private MockMvc mockMvc;
    private final String url = "/api/v1/livros";
    private Assunto assunto;
    private Autor autor;

    @Autowired
    private LivroController livroController;

    @Autowired
    private AssuntoRepository assuntoRepository;

    @Autowired
    private AutorRepository autorRepository;

    @Autowired
    private LivroRepository livroRepository;

    @BeforeAll
    public static void setUpBeforeClass() throws Exception {
        postgreSQLContainer.start();
    }

    @AfterAll
    public static void tearDownAfterClass() throws Exception {
        postgreSQLContainer.stop();
    }

    @BeforeEach
    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(livroController).build();
        this.autor = new Autor();
        this.autor.setNome("MATEUS EDUARDO GOBO");
        this.autorRepository.save(autor);

        this.assunto = new Assunto();
        this.assunto.setDescricao("COMPORTAMENTAL");
        this.assuntoRepository.save(assunto);
    }

    @Order(1)
    @Test
    public void testCreate() throws Exception {
        AutorDto autorDto = AutorMapper.INSTANCE.toDto(autor);
        AssuntoDto assuntoDto = AssuntoMapper.INSTANCE.toDto(assunto);
        LivroDto livroDto = new LivroDto(null, "A ARTE DA GUERRA", "BRASIL", "1", "2024", "32,50", assuntoDto.id(), "", autorDto.id(), "");
        ResultActions resultActions = this.mockMvc.perform(MockMvcRequestBuilders.post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(parserObject.toJson(livroDto)));
        int status = resultActions.andReturn().getResponse().getStatus();
        try {
            assertEquals(201, status, "Sucesso na requisição");
        } catch (Exception e) {
            fail(ERROR_REQUEST.formatted(e.getMessage(), status));
        }
    }

    @Order(2)
    @Test
    public void testUpdate() throws Exception {
        AutorDto autorDto = AutorMapper.INSTANCE.toDto(autor);
        AssuntoDto assuntoDto = AssuntoMapper.INSTANCE.toDto(assunto);
        LivroDto livroDto = new LivroDto(null, "A ARTE DA PAZ", "BRASIL", "2", "2023", "32,50", assuntoDto.id(), "", autorDto.id(), "");

        Livro livro = this.livroRepository.save(INSTANCE.toEntity(livroDto));
        LivroDto livroDtoUpdate = new LivroDto(livro.getId(), livro.getTitulo(), livro.getEditora(), livro.getEdicao().toString(), livro.getAnoPublicacao(), "20,50",assuntoDto.id(), "", autorDto.id(), "");

        ResultActions resultActions = this.mockMvc.perform(MockMvcRequestBuilders.put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(parserObject.toJson(livroDtoUpdate)));
        int status = resultActions.andReturn().getResponse().getStatus();
        try {
            assertEquals(202, status, "Sucesso na requisição");
        } catch (Exception e) {
            fail(ERROR_REQUEST.formatted(e.getMessage(), status));
        }
    }

    @Order(3)
    @Test
    public void testFindById() throws Exception {
        ResultActions resultActions = this.mockMvc.perform(MockMvcRequestBuilders.get(url.concat("/find/%s").formatted(1)));
        int status = resultActions.andReturn().getResponse().getStatus();
        try {
            assertEquals(true, (status == 200 || status == 404), "Sucesso na requisição");
            System.out.println(resultActions.andReturn().getResponse().getContentAsString());
        } catch (Exception e) {
            fail(ERROR_REQUEST.formatted(e.getMessage(), status));
        }
    }

    @Order(4)
    @Test
    public void testFindAll() throws Exception {
        ResultActions resultActions = this.mockMvc.perform(MockMvcRequestBuilders.get(url));
        int status = resultActions.andReturn().getResponse().getStatus();
        try {
            assertEquals(200, status, "Sucesso na requisição");
            System.out.println(resultActions.andReturn().getResponse().getContentAsString());
        } catch (Exception e) {
            fail(ERROR_REQUEST.formatted(e.getMessage(), status));
        }
    }
}
