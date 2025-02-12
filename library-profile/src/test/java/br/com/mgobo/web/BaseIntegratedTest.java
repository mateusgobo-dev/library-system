package br.com.mgobo.web;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

public class BaseIntegratedTest {
    protected  final String ERROR_REQUEST  = "Erro na requisição %s, status %s";
    protected static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>(DockerImageName.parse("postgres"))
            .withDatabaseName("library-db")
            .withUsername("sa")
            .withPassword("123");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", ()-> postgreSQLContainer.getJdbcUrl());
        registry.add("spring.datasource.username", ()-> postgreSQLContainer.getUsername());
        registry.add("spring.datasource.password", ()-> postgreSQLContainer.getPassword());
        registry.add("spring.datasource.hikari.maximum-pool-size", () -> 100);
        registry.add("spring.datasource.hikari.minimum-idle", () -> 10);
        registry.add("spring.datasource.hikari.pool-name", () -> "library-profile");
        registry.add("spring.datasource.hikari.max-lifetime", () -> 30000);
        registry.add("spring.jpa.hibernate.ddl-auto", ()-> "create");
        registry.add("spring.jpa.show-sql", () -> true);
    }
}
