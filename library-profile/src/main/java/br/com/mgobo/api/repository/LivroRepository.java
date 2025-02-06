package br.com.mgobo.api.repository;

import br.com.mgobo.api.entities.Autor;
import br.com.mgobo.api.entities.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {
}
