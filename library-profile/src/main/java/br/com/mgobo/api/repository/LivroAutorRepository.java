package br.com.mgobo.api.repository;

import br.com.mgobo.api.entities.Autor;
import br.com.mgobo.api.entities.Livro;
import br.com.mgobo.api.entities.LivroAutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivroAutorRepository extends JpaRepository<LivroAutor, Long> {
    LivroAutor findLivroAutorByAutor(Autor autor);
    void deleteAllByLivro(Livro livro, Autor autor);
}
