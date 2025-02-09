//package br.com.mgobo.api.repository;
//
//import br.com.mgobo.api.entities.Livro;
//import br.com.mgobo.api.entities.Livro_;
//import jakarta.persistence.EntityManager;
//import jakarta.persistence.EntityManagerFactory;
//import jakarta.persistence.NoResultException;
//import jakarta.persistence.TypedQuery;
//import jakarta.persistence.criteria.CriteriaBuilder;
//import jakarta.persistence.criteria.CriteriaQuery;
//import jakarta.persistence.criteria.JoinType;
//import jakarta.persistence.criteria.Root;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//@RequiredArgsConstructor
//@Slf4j
//public class LivroRepositoryImpl {
//    private final EntityManagerFactory entityManagerFactory;
//
//    @Transactional
//    public List<Livro> findAll() throws Exception {
//        EntityManager entityManager = entityManagerFactory.createEntityManager();
//        try {
//            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
//            CriteriaQuery<Livro> cq = cb.createQuery(Livro.class);
//            Root<Livro> from = cq.from(Livro.class);
//                                  from.join(Livro_.livroAutorCollection, JoinType.LEFT);
//                                  from.join(Livro_.livroAssuntoCollection, JoinType.LEFT);
//            TypedQuery<Livro> query = entityManager.createQuery(cq.select(from).orderBy(cb.asc(from.get(Livro_.titulo))));
//
//            return query.getResultList();
//        } catch (Exception e) {
//            log.error(e.getMessage(), e);
//            throw new Exception(e.getMessage(), e);
//        } finally {
//            entityManager.clear();
//            entityManager.close();
//        }
//    }
//
//    public Livro findById(Long id) throws Exception {
//        EntityManager entityManager = entityManagerFactory.createEntityManager();
//        try {
//            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
//            CriteriaQuery<Livro> cq = cb.createQuery(Livro.class);
//            Root<Livro> from = cq.from(Livro.class);
//                                  from.join(Livro_.livroAutorCollection, JoinType.LEFT);
//                                  from.join(Livro_.livroAssuntoCollection, JoinType.LEFT);
//            try {
//                TypedQuery<Livro> query = entityManager.createQuery(cq.select(from).where(cb.equal(from.get(Livro_.id), id)));
//                return query.getSingleResult();
//            } catch (NoResultException ex) {
//                log.error(ex.getMessage(), ex);
//                throw new Exception(ex.getMessage(), ex);
//            }
//        } catch (Exception e) {
//            log.error(e.getMessage(), e);
//            throw new Exception(e.getMessage(), e);
//        } finally {
//            entityManager.clear();
//            entityManager.close();
//        }
//    }
//}
