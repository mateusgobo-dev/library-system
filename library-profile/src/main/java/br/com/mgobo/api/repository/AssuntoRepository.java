package br.com.mgobo.api.repository;

import br.com.mgobo.api.entities.Assunto;
import br.com.mgobo.api.entities.Autor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssuntoRepository extends JpaRepository<Assunto, Long> {
}
