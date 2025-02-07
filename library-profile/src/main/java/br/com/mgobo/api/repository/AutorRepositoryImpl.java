package br.com.mgobo.api.repository;

import br.com.mgobo.api.entities.Autor;
import br.com.mgobo.api.entities.Autor_;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

import static br.com.mgobo.web.mappers.AutorMapper.INSTANCE;

@Repository
@RequiredArgsConstructor
@Slf4j
public class AutorRepositoryImpl  {
    private final EntityManagerFactory entityManagerFactory;

    public List<Autor> findAll() throws Exception {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<Autor> cq = cb.createQuery(Autor.class);
            Root<Autor> from = cq.from(Autor.class);
                                   from.join(Autor_.livroAutorCollection, JoinType.LEFT);
            TypedQuery<Autor> query = entityManager.createQuery(cq.select(from).orderBy(cb.asc(from.get(Autor_.nome))));
            return query.getResultList();
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new Exception(e.getMessage(), e);
        } finally {
            entityManager.clear();
            entityManager.close();
        }
    }

    public Autor findById(Long id) throws Exception {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<Autor> cq = cb.createQuery(Autor.class);
            Root<Autor> from = cq.from(Autor.class);
                                    from.join(Autor_.livroAutorCollection, JoinType.LEFT);
            try {
                TypedQuery<Autor> query = entityManager.createQuery(cq.select(from).where(cb.equal(from.get(Autor_.id), id)));
                return query.getSingleResult();
            } catch (NoResultException ex) {
                log.error(ex.getMessage(), ex);
                throw new Exception(ex.getMessage(), ex);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new Exception(e.getMessage(), e);
        } finally {
            entityManager.clear();
            entityManager.close();
        }
    }
}
