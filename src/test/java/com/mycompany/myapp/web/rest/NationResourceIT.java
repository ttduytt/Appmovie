package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.NationAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Nation;
import com.mycompany.myapp.repository.NationRepository;
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
 * Integration tests for the {@link NationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NationResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/nations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private NationRepository nationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNationMockMvc;

    private Nation nation;

    private Nation insertedNation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Nation createEntity() {
        return new Nation().name(DEFAULT_NAME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Nation createUpdatedEntity() {
        return new Nation().name(UPDATED_NAME);
    }

    @BeforeEach
    public void initTest() {
        nation = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedNation != null) {
            nationRepository.delete(insertedNation);
            insertedNation = null;
        }
    }

    @Test
    @Transactional
    void createNation() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Nation
        var returnedNation = om.readValue(
            restNationMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(nation)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Nation.class
        );

        // Validate the Nation in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertNationUpdatableFieldsEquals(returnedNation, getPersistedNation(returnedNation));

        insertedNation = returnedNation;
    }

    @Test
    @Transactional
    void createNationWithExistingId() throws Exception {
        // Create the Nation with an existing ID
        nation.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(nation)))
            .andExpect(status().isBadRequest());

        // Validate the Nation in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNations() throws Exception {
        // Initialize the database
        insertedNation = nationRepository.saveAndFlush(nation);

        // Get all the nationList
        restNationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(nation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getNation() throws Exception {
        // Initialize the database
        insertedNation = nationRepository.saveAndFlush(nation);

        // Get the nation
        restNationMockMvc
            .perform(get(ENTITY_API_URL_ID, nation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(nation.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingNation() throws Exception {
        // Get the nation
        restNationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingNation() throws Exception {
        // Initialize the database
        insertedNation = nationRepository.saveAndFlush(nation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the nation
        Nation updatedNation = nationRepository.findById(nation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedNation are not directly saved in db
        em.detach(updatedNation);
        updatedNation.name(UPDATED_NAME);

        restNationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedNation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedNation))
            )
            .andExpect(status().isOk());

        // Validate the Nation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedNationToMatchAllProperties(updatedNation);
    }

    @Test
    @Transactional
    void putNonExistingNation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        nation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNationMockMvc
            .perform(put(ENTITY_API_URL_ID, nation.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(nation)))
            .andExpect(status().isBadRequest());

        // Validate the Nation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        nation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(nation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Nation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        nation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(nation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Nation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNationWithPatch() throws Exception {
        // Initialize the database
        insertedNation = nationRepository.saveAndFlush(nation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the nation using partial update
        Nation partialUpdatedNation = new Nation();
        partialUpdatedNation.setId(nation.getId());

        partialUpdatedNation.name(UPDATED_NAME);

        restNationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedNation))
            )
            .andExpect(status().isOk());

        // Validate the Nation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertNationUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedNation, nation), getPersistedNation(nation));
    }

    @Test
    @Transactional
    void fullUpdateNationWithPatch() throws Exception {
        // Initialize the database
        insertedNation = nationRepository.saveAndFlush(nation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the nation using partial update
        Nation partialUpdatedNation = new Nation();
        partialUpdatedNation.setId(nation.getId());

        partialUpdatedNation.name(UPDATED_NAME);

        restNationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedNation))
            )
            .andExpect(status().isOk());

        // Validate the Nation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertNationUpdatableFieldsEquals(partialUpdatedNation, getPersistedNation(partialUpdatedNation));
    }

    @Test
    @Transactional
    void patchNonExistingNation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        nation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, nation.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(nation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Nation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        nation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(nation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Nation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        nation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNationMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(nation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Nation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNation() throws Exception {
        // Initialize the database
        insertedNation = nationRepository.saveAndFlush(nation);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the nation
        restNationMockMvc
            .perform(delete(ENTITY_API_URL_ID, nation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return nationRepository.count();
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

    protected Nation getPersistedNation(Nation nation) {
        return nationRepository.findById(nation.getId()).orElseThrow();
    }

    protected void assertPersistedNationToMatchAllProperties(Nation expectedNation) {
        assertNationAllPropertiesEquals(expectedNation, getPersistedNation(expectedNation));
    }

    protected void assertPersistedNationToMatchUpdatableProperties(Nation expectedNation) {
        assertNationAllUpdatablePropertiesEquals(expectedNation, getPersistedNation(expectedNation));
    }
}
