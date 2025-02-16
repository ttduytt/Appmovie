package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Movie;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class MovieRepositoryWithBagRelationshipsImpl implements MovieRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String MOVIES_PARAMETER = "movies";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Movie> fetchBagRelationships(Optional<Movie> movie) {
        return movie.map(this::fetchActors).map(this::fetchTopics);
    }

    @Override
    public Page<Movie> fetchBagRelationships(Page<Movie> movies) {
        return new PageImpl<>(fetchBagRelationships(movies.getContent()), movies.getPageable(), movies.getTotalElements());
    }

    @Override
    public List<Movie> fetchBagRelationships(List<Movie> movies) {
        return Optional.of(movies).map(this::fetchActors).map(this::fetchTopics).orElse(Collections.emptyList());
    }

    Movie fetchActors(Movie result) {
        return entityManager
            .createQuery("select movie from Movie movie left join fetch movie.actors where movie.id = :id", Movie.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Movie> fetchActors(List<Movie> movies) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, movies.size()).forEach(index -> order.put(movies.get(index).getId(), index));
        List<Movie> result = entityManager
            .createQuery("select movie from Movie movie left join fetch movie.actors where movie in :movies", Movie.class)
            .setParameter(MOVIES_PARAMETER, movies)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    Movie fetchTopics(Movie result) {
        return entityManager
            .createQuery("select movie from Movie movie left join fetch movie.topics where movie.id = :id", Movie.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Movie> fetchTopics(List<Movie> movies) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, movies.size()).forEach(index -> order.put(movies.get(index).getId(), index));
        List<Movie> result = entityManager
            .createQuery("select movie from Movie movie left join fetch movie.topics where movie in :movies", Movie.class)
            .setParameter(MOVIES_PARAMETER, movies)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
