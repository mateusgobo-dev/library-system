package br.com.mgobo.api.repository;

import br.com.mgobo.api.entities.Assunto;
import br.com.mgobo.api.entities.Assunto_;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

import static br.com.mgobo.api.HttpErrorsMessage.BAD_REQUEST;
import static br.com.mgobo.web.mappers.AssuntoMapper.INSTANCE;

@Repository
@RequiredArgsConstructor
@Slf4j
public class AssuntoRepositoryImpl {

    private final EntityManagerFactory entityManagerFactory;

    public List<Assunto> findAll() throws Exception {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<Assunto> cq = cb.createQuery(Assunto.class);
            Root<Assunto> from = cq.from(Assunto.class);
            from.join(Assunto_.livroAssuntoCollection, JoinType.LEFT);
            TypedQuery<Assunto> query = entityManager.createQuery(cq.select(from).orderBy(cb.asc(from.get(Assunto_.descricao))));
            return query.getResultList();
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new Exception(e.getMessage(), e);
        } finally {
            entityManager.clear();
            entityManager.close();
        }
    }

    public Assunto findById(Long id) throws Exception {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<Assunto> cq = cb.createQuery(Assunto.class);
            Root<Assunto> from = cq.from(Assunto.class);
            from.join(Assunto_.livroAssuntoCollection, JoinType.LEFT);
            try {
                TypedQuery<Assunto> query = entityManager.createQuery(cq.select(from).where(cb.equal(from.get(Assunto_.id), id)));
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
