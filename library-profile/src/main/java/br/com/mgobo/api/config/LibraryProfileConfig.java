package br.com.mgobo.api.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;

@Primary
@ComponentScan(value = "br.com.mgobo.*")
@Configuration
@RequiredArgsConstructor
@Slf4j
public class LibraryProfileConfig {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(value = {ApplicationStartedEvent.class})
    public void onApplicationEvent(ApplicationStartedEvent event) {
        log.info("Application started in %s seconds".formatted(event.getTimeTaken().getSeconds()));
        log.info("Registrando view no banco de dados...");
        try {
            jdbcTemplate.execute("CREATE OR REPLACE VIEW VW_RELATORIO_LIVROS AS\n" +
                    "SELECT L.ID, L.TITULO, L.ANO_PUBLICACAO, L.EDICAO, L.EDITORA, A.NOME, ASS.DESCRICAO, L.PRECO\n" +
                    "FROM LIVRO L\n" +
                    "         INNER JOIN LIVRO_AUTOR LA ON LA.LIVRO_ID = L.ID\n" +
                    "         INNER JOIN AUTOR A ON A.ID = LA.AUTOR_ID\n" +
                    "         INNER JOIN LIVRO_ASSUNTO LAS ON LAS.LIVRO_ID = L.ID\n" +
                    "         INNER JOIN ASSUNTO ASS ON ASS.ID = LAS.ASSUNTO_ID\n" +
                    "GROUP BY A.NOME, L.TITULO, L.ANO_PUBLICACAO, L.EDICAO, L.EDITORA, ASS.DESCRICAO, L.ID\n" +
                    "ORDER BY A.NOME ASC");
        }catch (Exception ex){
            log.error("Erro no registro da view VW_RELATORIO_LIVROS, Error {}", ex.getMessage());
        }
    }
}
