package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Movie;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Movie entity.
 *
 * When extending this class, extend MovieRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface MovieRepository extends MovieRepositoryWithBagRelationships, JpaRepository<Movie, Long> {
    default Optional<Movie> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Movie> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Movie> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    @Query(value = "SELECT m FROM Movie m WHERE m.id IN :ids")
    List<Movie> findMoviesByIds(@Param("ids") List<Long> ids);

    // Tìm kiếm theo nationId, topicId và releaseYear
    @Query(
        "SELECT m FROM Movie m " +
        "JOIN m.topics t " + // JOIN với bảng liên kết 'topic'
        "WHERE (:nationId IS NULL OR m.nation.id = :nationId) " + // Lọc theo nationId nếu có
        "AND (:topicId IS NULL OR t.id = :topicId) " + // Lọc theo topicId nếu có
        "AND (:releaseYear IS NULL OR YEAR(m.release) = :releaseYear)"
    ) // Lọc theo releaseYear nếu có
    List<Movie> findMoviesByFilters(
        @Param("nationId") Long nationId, // nationId là ID của quốc gia
        @Param("topicId") Long topicId, // topicId là ID của thể loại
        @Param("releaseYear") Integer releaseYear
    ); // releaseYear là năm phát hành
}
