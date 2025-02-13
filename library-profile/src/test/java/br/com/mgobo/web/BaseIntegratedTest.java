package br.com.mgobo.web;

import br.com.mgobo.web.controller.AssuntoControllerTest;
import br.com.mgobo.web.controller.AutorControllerTest;
import br.com.mgobo.web.controller.LivroControllerTest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import java.time.Duration;

public class BaseIntegratedTest {
    protected  final String ERROR_REQUEST  = "Erro na requisição %s, status %s";
    protected static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>(DockerImageName.parse("postgres"))
            .withDatabaseName("library-db")
            .withUsername("sa")
            .withPassword("123")
            .withCreateContainerCmdModifier((cmd) -> cmd.withHostName("127.0.0.1").getHostConfig().withMemory(2048 * 1024 * 1024L))
            .withStartupTimeout(Duration.ofSeconds(60));

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.hikari.jdbc-url", ()-> postgreSQLContainer.getJdbcUrl());
        registry.add("spring.datasource.hikari.username", ()-> postgreSQLContainer.getUsername());
        registry.add("spring.datasource.hikari.password", ()-> postgreSQLContainer.getPassword());
        registry.add("spring.datasource.hikari.maximum-pool-size", () -> 10);
        registry.add("spring.datasource.hikari.minimum-idle", () -> 5);
        registry.add("spring.datasource.hikari.pool-name", () -> "library-profile");
        registry.add("spring.datasource.hikari.max-lifetime", () -> 5000);
        registry.add("spring.datasource.hikari.connection-timeout", () -> 5000);
        registry.add("spring.jpa.hibernate.ddl-auto", ()-> "update");
        registry.add("spring.jpa.show-sql", () -> true);
    }

    @BeforeAll
    public static void setUpBeforeClass() {
        postgreSQLContainer.start();
    }

    @AfterAll
    public static void tearDownAfterClass() {
        postgreSQLContainer.stop();
    }
}
