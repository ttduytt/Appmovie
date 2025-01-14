package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Nation;
import com.mycompany.myapp.repository.NationRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Nation}.
 */
@RestController
@RequestMapping("/api/nations")
@Transactional
public class NationResource {

    private static final Logger LOG = LoggerFactory.getLogger(NationResource.class);

    private static final String ENTITY_NAME = "nation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NationRepository nationRepository;

    public NationResource(NationRepository nationRepository) {
        this.nationRepository = nationRepository;
    }

    /**
     * {@code POST  /nations} : Create a new nation.
     *
     * @param nation the nation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new nation, or with status {@code 400 (Bad Request)} if the nation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Nation> createNation(@RequestBody Nation nation) throws URISyntaxException {
        LOG.debug("REST request to save Nation : {}", nation);
        if (nation.getId() != null) {
            throw new BadRequestAlertException("A new nation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        nation = nationRepository.save(nation);
        return ResponseEntity.created(new URI("/api/nations/" + nation.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, nation.getId().toString()))
            .body(nation);
    }

    /**
     * {@code PUT  /nations/:id} : Updates an existing nation.
     *
     * @param id the id of the nation to save.
     * @param nation the nation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nation,
     * or with status {@code 400 (Bad Request)} if the nation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the nation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Nation> updateNation(@PathVariable(value = "id", required = false) final Long id, @RequestBody Nation nation)
        throws URISyntaxException {
        LOG.debug("REST request to update Nation : {}, {}", id, nation);
        if (nation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!nationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        nation = nationRepository.save(nation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, nation.getId().toString()))
            .body(nation);
    }

    /**
     * {@code PATCH  /nations/:id} : Partial updates given fields of an existing nation, field will ignore if it is null
     *
     * @param id the id of the nation to save.
     * @param nation the nation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nation,
     * or with status {@code 400 (Bad Request)} if the nation is not valid,
     * or with status {@code 404 (Not Found)} if the nation is not found,
     * or with status {@code 500 (Internal Server Error)} if the nation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Nation> partialUpdateNation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Nation nation
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Nation partially : {}, {}", id, nation);
        if (nation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!nationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Nation> result = nationRepository
            .findById(nation.getId())
            .map(existingNation -> {
                if (nation.getName() != null) {
                    existingNation.setName(nation.getName());
                }

                return existingNation;
            })
            .map(nationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, nation.getId().toString())
        );
    }

    /**
     * {@code GET  /nations} : get all the nations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of nations in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Nation>> getAllNations(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Nations");
        Page<Nation> page = nationRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /nations/:id} : get the "id" nation.
     *
     * @param id the id of the nation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the nation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Nation> getNation(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Nation : {}", id);
        Optional<Nation> nation = nationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(nation);
    }

    /**
     * {@code DELETE  /nations/:id} : delete the "id" nation.
     *
     * @param id the id of the nation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNation(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Nation : {}", id);
        nationRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
