package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Movie;
import com.mycompany.myapp.repository.MovieRepository;
import com.mycompany.myapp.service.RedisMovieService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Movie}.
 */
@RestController
@RequestMapping("/api/movies")
@Transactional
public class MovieResource {

    private static final Logger LOG = LoggerFactory.getLogger(MovieResource.class);

    private static final String ENTITY_NAME = "movie";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MovieRepository movieRepository;
    private final RedisMovieService redisMovieService;

    public MovieResource(MovieRepository movieRepository, RedisMovieService redisMovieService) {
        this.movieRepository = movieRepository;
        this.redisMovieService = redisMovieService;
    }

    /**
     * {@code POST  /movies} : Create a new movie.
     *
     * @param movie the movie to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new movie, or with status {@code 400 (Bad Request)} if the movie has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) throws URISyntaxException {
        LOG.debug("REST request to save Movie : {}", movie);
        if (movie.getId() != null) {
            throw new BadRequestAlertException("A new movie cannot already have an ID", ENTITY_NAME, "idexists");
        }
        movie = movieRepository.save(movie);
        return ResponseEntity.created(new URI("/api/movies/" + movie.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, movie.getId().toString()))
            .body(movie);
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> updateView(@PathVariable("id") final String id) {
        redisMovieService.incrementViewCount(id);
        return ResponseEntity.ok("Movie ID: " + id);
    }

    @DeleteMapping("/delete-topview")
    public void deleteTopView() {
        //        redisMovieService.deleteTopmovie();
        System.out.print("dd mẹ mày.");
    }

    @GetMapping("/topView")
    public ResponseEntity<List<Map<String, Object>>> getTopViewedMovies(@RequestParam(name = "topN", defaultValue = "10") int topN) {
        try {
            // Lấy danh sách các bộ phim từ Redis
            List<Map<String, Object>> topMovies = redisMovieService.getTopViewedMovies(topN);

            // Nếu không có dữ liệu từ Redis, lấy từ CSDL
            if (topMovies == null || topMovies.isEmpty()) {
                topMovies = movieRepository.getTopview(topN);
            }

            return ResponseEntity.ok(topMovies);
        } catch (Exception e) {
            // Xử lý lỗi
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    /**
     * {@code PUT  /movies/:id} : Updates an existing movie.
     *
     * @param id the id of the movie to save.
     * @param movie the movie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated movie,
     * or with status {@code 400 (Bad Request)} if the movie is not valid,
     * or with status {@code 500 (Internal Server Error)} if the movie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable(value = "id", required = false) final Long id, @RequestBody Movie movie)
        throws URISyntaxException {
        LOG.debug("REST request to update Movie : {}, {}", id, movie);
        if (movie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, movie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!movieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        movie = movieRepository.save(movie);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, movie.getId().toString()))
            .body(movie);
    }

    /**
     * {@code PATCH  /movies/:id} : Partial updates given fields of an existing movie, field will ignore if it is null
     *
     * @param id the id of the movie to save.
     * @param movie the movie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated movie,
     * or with status {@code 400 (Bad Request)} if the movie is not valid,
     * or with status {@code 404 (Not Found)} if the movie is not found,
     * or with status {@code 500 (Internal Server Error)} if the movie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Movie> partialUpdateMovie(@PathVariable(value = "id", required = false) final Long id, @RequestBody Movie movie)
        throws URISyntaxException {
        LOG.debug("REST request to partial update Movie partially : {}, {}", id, movie);
        if (movie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, movie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!movieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Movie> result = movieRepository
            .findById(movie.getId())
            .map(existingMovie -> {
                if (movie.getMovieName() != null) {
                    existingMovie.setMovieName(movie.getMovieName());
                }
                if (movie.getRelease() != null) {
                    existingMovie.setRelease(movie.getRelease());
                }
                if (movie.getAuthor() != null) {
                    existingMovie.setAuthor(movie.getAuthor());
                }
                if (movie.getView() != null) {
                    existingMovie.setView(movie.getView());
                }
                if (movie.getDescription() != null) {
                    existingMovie.setDescription(movie.getDescription());
                }
                if (movie.getNumberEpisode() != null) {
                    existingMovie.setNumberEpisode(movie.getNumberEpisode());
                }
                if (movie.getAvatar() != null) {
                    existingMovie.setAvatar(movie.getAvatar());
                }
                if (movie.getLinkMovie() != null) {
                    existingMovie.setLinkMovie(movie.getLinkMovie());
                }

                return existingMovie;
            })
            .map(movieRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, movie.getId().toString())
        );
    }

    /**
     * {@code GET  /movies} : get all the movies.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of movies in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Movie>> getAllMovies(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of Movies");
        Page<Movie> page;
        if (eagerload) {
            page = movieRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = movieRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /movies/:id} : get the "id" movie.
     *
     * @param id the id of the movie to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the movie, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovie(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Movie : {}", id);
        Optional<Movie> movie = movieRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(movie);
    }

    /**
     * {@code DELETE  /movies/:id} : delete the "id" movie.
     *
     * @param id the id of the movie to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Movie : {}", id);
        movieRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
