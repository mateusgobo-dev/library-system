package br.com.mgobo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
@SpringBootApplication
public class LibraryProfileApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryProfileApplication.class, args);
    }

}
