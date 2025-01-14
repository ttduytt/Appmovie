package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Nation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Nation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NationRepository extends JpaRepository<Nation, Long> {}
