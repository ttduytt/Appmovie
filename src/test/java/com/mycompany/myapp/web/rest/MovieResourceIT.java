package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.MovieAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Movie;
import com.mycompany.myapp.repository.MovieRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MovieResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MovieResourceIT {

    private static final String DEFAULT_MOVIE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MOVIE_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_RELEASE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_RELEASE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final Integer DEFAULT_VIEW = 1;
    private static final Integer UPDATED_VIEW = 2;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMBER_EPISODE = 1;
    private static final Integer UPDATED_NUMBER_EPISODE = 2;

    private static final String DEFAULT_AVATAR = "AAAAAAAAAA";
    private static final String UPDATED_AVATAR = "BBBBBBBBBB";

    private static final String DEFAULT_LINK_MOVIE = "AAAAAAAAAA";
    private static final String UPDATED_LINK_MOVIE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/movies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private MovieRepository movieRepository;

    @Mock
    private MovieRepository movieRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMovieMockMvc;

    private Movie movie;

    private Movie insertedMovie;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Movie createEntity() {
        return new Movie()
            .movieName(DEFAULT_MOVIE_NAME)
            .release(DEFAULT_RELEASE)
            .author(DEFAULT_AUTHOR)
            .view(DEFAULT_VIEW)
            .description(DEFAULT_DESCRIPTION)
            .numberEpisode(DEFAULT_NUMBER_EPISODE)
            .avatar(DEFAULT_AVATAR)
            .linkMovie(DEFAULT_LINK_MOVIE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Movie createUpdatedEntity() {
        return new Movie()
            .movieName(UPDATED_MOVIE_NAME)
            .release(UPDATED_RELEASE)
            .author(UPDATED_AUTHOR)
            .view(UPDATED_VIEW)
            .description(UPDATED_DESCRIPTION)
            .numberEpisode(UPDATED_NUMBER_EPISODE)
            .avatar(UPDATED_AVATAR)
            .linkMovie(UPDATED_LINK_MOVIE);
    }

    @BeforeEach
    public void initTest() {
        movie = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedMovie != null) {
            movieRepository.delete(insertedMovie);
            insertedMovie = null;
        }
    }

    @Test
    @Transactional
    void createMovie() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Movie
        var returnedMovie = om.readValue(
            restMovieMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(movie)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Movie.class
        );

        // Validate the Movie in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertMovieUpdatableFieldsEquals(returnedMovie, getPersistedMovie(returnedMovie));

        insertedMovie = returnedMovie;
    }

    @Test
    @Transactional
    void createMovieWithExistingId() throws Exception {
        // Create the Movie with an existing ID
        movie.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMovieMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(movie)))
            .andExpect(status().isBadRequest());

        // Validate the Movie in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMovies() throws Exception {
        // Initialize the database
        insertedMovie = movieRepository.saveAndFlush(movie);

        // Get all the movieList
        restMovieMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(movie.getId().intValue())))
            .andExpect(jsonPath("$.[*].movieName").value(hasItem(DEFAULT_MOVIE_NAME)))
            .andExpect(jsonPath("$.[*].release").value(hasItem(DEFAULT_RELEASE.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR)))
            .andExpect(jsonPath("$.[*].view").value(hasItem(DEFAULT_VIEW)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].numberEpisode").value(hasItem(DEFAULT_NUMBER_EPISODE)))
            .andExpect(jsonPath("$.[*].avatar").value(hasItem(DEFAULT_AVATAR)))
            .andExpect(jsonPath("$.[*].linkMovie").value(hasItem(DEFAULT_LINK_MOVIE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMoviesWithEagerRelationshipsIsEnabled() throws Exception {
        when(movieRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMovieMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(movieRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMoviesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(movieRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMovieMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(movieRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getMovie() throws Exception {
        // Initialize the database
        insertedMovie = movieRepository.saveAndFlush(movie);

        // Get the movie
        restMovieMockMvc
            .perform(get(ENTITY_API_URL_ID, movie.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(movie.getId().intValue()))
            .andExpect(jsonPath("$.movieName").value(DEFAULT_MOVIE_NAME))
            .andExpect(jsonPath("$.release").value(DEFAULT_RELEASE.toString()))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR))
            .andExpect(jsonPath("$.view").value(DEFAULT_VIEW))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.numberEpisode").value(DEFAULT_NUMBER_EPISODE))
            .andExpect(jsonPath("$.avatar").value(DEFAULT_AVATAR))
            .andExpect(jsonPath("$.linkMovie").value(DEFAULT_LINK_MOVIE));
    }

    @Test
    @Transactional
    void getNonExistingMovie() throws Exception {
        // Get the movie
        restMovieMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMovie() throws Exception {
        // Initialize the database
        insertedMovie = movieRepository.saveAndFlush(movie);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the movie
        Movie updatedMovie = movieRepository.findById(movie.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMovie are not directly saved in db
        em.detach(updatedMovie);
        updatedMovie
            .movieName(UPDATED_MOVIE_NAME)
            .release(UPDATED_RELEASE)
            .author(UPDATED_AUTHOR)
            .view(UPDATED_VIEW)
            .description(UPDATED_DESCRIPTION)
            .numberEpisode(UPDATED_NUMBER_EPISODE)
            .avatar(UPDATED_AVATAR)
            .linkMovie(UPDATED_LINK_MOVIE);

        restMovieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMovie.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedMovie))
            )
            .andExpect(status().isOk());

        // Validate the Movie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedMovieToMatchAllProperties(updatedMovie);
    }

    @Test
    @Transactional
    void putNonExistingMovie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movie.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMovieMockMvc
            .perform(put(ENTITY_API_URL_ID, movie.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(movie)))
            .andExpect(status().isBadRequest());

        // Validate the Movie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMovie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movie.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMovieMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(movie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Movie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMovie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movie.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMovieMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(movie)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Movie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMovieWithPatch() throws Exception {
        // Initialize the database
        insertedMovie = movieRepository.saveAndFlush(movie);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the movie using partial update
        Movie partialUpdatedMovie = new Movie();
        partialUpdatedMovie.setId(movie.getId());

        partialUpdatedMovie
            .release(UPDATED_RELEASE)
            .view(UPDATED_VIEW)
            .description(UPDATED_DESCRIPTION)
            .numberEpisode(UPDATED_NUMBER_EPISODE);

        restMovieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMovie.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMovie))
            )
            .andExpect(status().isOk());

        // Validate the Movie in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMovieUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedMovie, movie), getPersistedMovie(movie));
    }

    @Test
    @Transactional
    void fullUpdateMovieWithPatch() throws Exception {
        // Initialize the database
        insertedMovie = movieRepository.saveAndFlush(movie);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the movie using partial update
        Movie partialUpdatedMovie = new Movie();
        partialUpdatedMovie.setId(movie.getId());

        partialUpdatedMovie
            .movieName(UPDATED_MOVIE_NAME)
            .release(UPDATED_RELEASE)
            .author(UPDATED_AUTHOR)
            .view(UPDATED_VIEW)
            .description(UPDATED_DESCRIPTION)
            .numberEpisode(UPDATED_NUMBER_EPISODE)
            .avatar(UPDATED_AVATAR)
            .linkMovie(UPDATED_LINK_MOVIE);

        restMovieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMovie.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMovie))
            )
            .andExpect(status().isOk());

        // Validate the Movie in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMovieUpdatableFieldsEquals(partialUpdatedMovie, getPersistedMovie(partialUpdatedMovie));
    }

    @Test
    @Transactional
    void patchNonExistingMovie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movie.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMovieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, movie.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(movie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Movie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMovie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movie.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMovieMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(movie))
            )
            .andExpect(status().isBadRequest());

        // Validate the Movie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMovie() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movie.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMovieMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(movie)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Movie in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMovie() throws Exception {
        // Initialize the database
        insertedMovie = movieRepository.saveAndFlush(movie);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the movie
        restMovieMockMvc
            .perform(delete(ENTITY_API_URL_ID, movie.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return movieRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Movie getPersistedMovie(Movie movie) {
        return movieRepository.findById(movie.getId()).orElseThrow();
    }

    protected void assertPersistedMovieToMatchAllProperties(Movie expectedMovie) {
        assertMovieAllPropertiesEquals(expectedMovie, getPersistedMovie(expectedMovie));
    }

    protected void assertPersistedMovieToMatchUpdatableProperties(Movie expectedMovie) {
        assertMovieAllUpdatablePropertiesEquals(expectedMovie, getPersistedMovie(expectedMovie));
    }
}
