package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.MovieTestSamples.*;
import static com.mycompany.myapp.domain.NationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class NationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Nation.class);
        Nation nation1 = getNationSample1();
        Nation nation2 = new Nation();
        assertThat(nation1).isNotEqualTo(nation2);

        nation2.setId(nation1.getId());
        assertThat(nation1).isEqualTo(nation2);

        nation2 = getNationSample2();
        assertThat(nation1).isNotEqualTo(nation2);
    }

    @Test
    void moviesTest() {
        Nation nation = getNationRandomSampleGenerator();
        Movie movieBack = getMovieRandomSampleGenerator();

        nation.addMovies(movieBack);
        assertThat(nation.getMovies()).containsOnly(movieBack);
        assertThat(movieBack.getNation()).isEqualTo(nation);

        nation.removeMovies(movieBack);
        assertThat(nation.getMovies()).doesNotContain(movieBack);
        assertThat(movieBack.getNation()).isNull();

        nation.movies(new HashSet<>(Set.of(movieBack)));
        assertThat(nation.getMovies()).containsOnly(movieBack);
        assertThat(movieBack.getNation()).isEqualTo(nation);

        nation.setMovies(new HashSet<>());
        assertThat(nation.getMovies()).doesNotContain(movieBack);
        assertThat(movieBack.getNation()).isNull();
    }
}
