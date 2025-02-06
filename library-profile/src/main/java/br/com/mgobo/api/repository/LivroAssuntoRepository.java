package br.com.mgobo.api.repository;

import br.com.mgobo.api.entities.Assunto;
import br.com.mgobo.api.entities.LivroAssunto;
import br.com.mgobo.api.entities.LivroAutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivroAssuntoRepository extends JpaRepository<LivroAssunto, Long> {
    LivroAutor findLivroAssuntoByAssunto(Assunto assunto);
}
