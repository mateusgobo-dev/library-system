package br.com.mgobo.web.controller;

import br.com.mgobo.web.BaseIntegratedTest;
import br.com.mgobo.web.dto.AssuntoDto;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static br.com.mgobo.api.parsers.ParserObject.parserObject;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AssuntoControllerTest extends BaseIntegratedTest {

    private MockMvc mockMvc;
    private final String url = "/api/v1/assuntos";

    @Autowired
    private AssuntoController assuntoController;

    @BeforeEach
    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(assuntoController).build();
    }

    @Order(1)
    @Test
    public void testCreate() throws Exception {
        AssuntoDto assuntoDto = new AssuntoDto(null, "COMPORTAMENTAL");
        ResultActions resultActions = this.mockMvc.perform(MockMvcRequestBuilders.post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(parserObject.toJson(assuntoDto)));
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
        AssuntoDto assuntoDto = new AssuntoDto(1L, "COMPORTAMENTAL");
        ResultActions resultActions = this.mockMvc.perform(MockMvcRequestBuilders.put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(parserObject.toJson(assuntoDto)));
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
        try{
            assertEquals(200, status, "Sucesso na requisição");
            System.out.println(resultActions.andReturn().getResponse().getContentAsString());
        }catch (Exception e){
            fail(ERROR_REQUEST.formatted(e.getMessage(), status));
        }
    }

    @Order(5)
    @Test
    public void deleteById() throws Exception {
        ResultActions resultActions = this.mockMvc.perform(MockMvcRequestBuilders.delete(url+"/1"));
        int status = resultActions.andReturn().getResponse().getStatus();
        try{
            assertEquals(HttpStatus.MOVED_PERMANENTLY.value(), status, "Sucesso na requisição");
            System.out.println(resultActions.andReturn().getResponse().getContentAsString());
        }catch (Exception e){
            fail(ERROR_REQUEST.formatted(e.getMessage(), status));
        }
    }
}
