package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ActorAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Actor;
import com.mycompany.myapp.repository.ActorRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ActorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActorResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_AGE = 1;
    private static final Integer UPDATED_AGE = 2;

    private static final Double DEFAULT_HEIGHT = 1D;
    private static final Double UPDATED_HEIGHT = 2D;

    private static final String ENTITY_API_URL = "/api/actors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ActorRepository actorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActorMockMvc;

    private Actor actor;

    private Actor insertedActor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Actor createEntity() {
        return new Actor().name(DEFAULT_NAME).age(DEFAULT_AGE).height(DEFAULT_HEIGHT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Actor createUpdatedEntity() {
        return new Actor().name(UPDATED_NAME).age(UPDATED_AGE).height(UPDATED_HEIGHT);
    }

    @BeforeEach
    public void initTest() {
        actor = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedActor != null) {
            actorRepository.delete(insertedActor);
            insertedActor = null;
        }
    }

    @Test
    @Transactional
    void createActor() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Actor
        var returnedActor = om.readValue(
            restActorMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(actor)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Actor.class
        );

        // Validate the Actor in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertActorUpdatableFieldsEquals(returnedActor, getPersistedActor(returnedActor));

        insertedActor = returnedActor;
    }

    @Test
    @Transactional
    void createActorWithExistingId() throws Exception {
        // Create the Actor with an existing ID
        actor.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(actor)))
            .andExpect(status().isBadRequest());

        // Validate the Actor in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllActors() throws Exception {
        // Initialize the database
        insertedActor = actorRepository.saveAndFlush(actor);

        // Get all the actorList
        restActorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(actor.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].age").value(hasItem(DEFAULT_AGE)))
            .andExpect(jsonPath("$.[*].height").value(hasItem(DEFAULT_HEIGHT.doubleValue())));
    }

    @Test
    @Transactional
    void getActor() throws Exception {
        // Initialize the database
        insertedActor = actorRepository.saveAndFlush(actor);

        // Get the actor
        restActorMockMvc
            .perform(get(ENTITY_API_URL_ID, actor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(actor.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.age").value(DEFAULT_AGE))
            .andExpect(jsonPath("$.height").value(DEFAULT_HEIGHT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingActor() throws Exception {
        // Get the actor
        restActorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActor() throws Exception {
        // Initialize the database
        insertedActor = actorRepository.saveAndFlush(actor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the actor
        Actor updatedActor = actorRepository.findById(actor.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedActor are not directly saved in db
        em.detach(updatedActor);
        updatedActor.name(UPDATED_NAME).age(UPDATED_AGE).height(UPDATED_HEIGHT);

        restActorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedActor))
            )
            .andExpect(status().isOk());

        // Validate the Actor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedActorToMatchAllProperties(updatedActor);
    }

    @Test
    @Transactional
    void putNonExistingActor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        actor.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActorMockMvc
            .perform(put(ENTITY_API_URL_ID, actor.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(actor)))
            .andExpect(status().isBadRequest());

        // Validate the Actor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        actor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(actor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Actor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        actor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(actor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Actor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActorWithPatch() throws Exception {
        // Initialize the database
        insertedActor = actorRepository.saveAndFlush(actor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the actor using partial update
        Actor partialUpdatedActor = new Actor();
        partialUpdatedActor.setId(actor.getId());

        partialUpdatedActor.height(UPDATED_HEIGHT);

        restActorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActor.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedActor))
            )
            .andExpect(status().isOk());

        // Validate the Actor in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertActorUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedActor, actor), getPersistedActor(actor));
    }

    @Test
    @Transactional
    void fullUpdateActorWithPatch() throws Exception {
        // Initialize the database
        insertedActor = actorRepository.saveAndFlush(actor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the actor using partial update
        Actor partialUpdatedActor = new Actor();
        partialUpdatedActor.setId(actor.getId());

        partialUpdatedActor.name(UPDATED_NAME).age(UPDATED_AGE).height(UPDATED_HEIGHT);

        restActorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActor.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedActor))
            )
            .andExpect(status().isOk());

        // Validate the Actor in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertActorUpdatableFieldsEquals(partialUpdatedActor, getPersistedActor(partialUpdatedActor));
    }

    @Test
    @Transactional
    void patchNonExistingActor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        actor.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, actor.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(actor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Actor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        actor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(actor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Actor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        actor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActorMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(actor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Actor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActor() throws Exception {
        // Initialize the database
        insertedActor = actorRepository.saveAndFlush(actor);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the actor
        restActorMockMvc
            .perform(delete(ENTITY_API_URL_ID, actor.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return actorRepository.count();
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

    protected Actor getPersistedActor(Actor actor) {
        return actorRepository.findById(actor.getId()).orElseThrow();
    }

    protected void assertPersistedActorToMatchAllProperties(Actor expectedActor) {
        assertActorAllPropertiesEquals(expectedActor, getPersistedActor(expectedActor));
    }

    protected void assertPersistedActorToMatchUpdatableProperties(Actor expectedActor) {
        assertActorAllUpdatablePropertiesEquals(expectedActor, getPersistedActor(expectedActor));
    }
}
