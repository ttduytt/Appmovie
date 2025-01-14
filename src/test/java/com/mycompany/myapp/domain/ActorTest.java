package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ActorTestSamples.*;
import static com.mycompany.myapp.domain.MovieTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ActorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Actor.class);
        Actor actor1 = getActorSample1();
        Actor actor2 = new Actor();
        assertThat(actor1).isNotEqualTo(actor2);

        actor2.setId(actor1.getId());
        assertThat(actor1).isEqualTo(actor2);

        actor2 = getActorSample2();
        assertThat(actor1).isNotEqualTo(actor2);
    }

    @Test
    void moviesTest() {
        Actor actor = getActorRandomSampleGenerator();
        Movie movieBack = getMovieRandomSampleGenerator();

        actor.addMovies(movieBack);
        assertThat(actor.getMovies()).containsOnly(movieBack);
        assertThat(movieBack.getActors()).containsOnly(actor);

        actor.removeMovies(movieBack);
        assertThat(actor.getMovies()).doesNotContain(movieBack);
        assertThat(movieBack.getActors()).doesNotContain(actor);

        actor.movies(new HashSet<>(Set.of(movieBack)));
        assertThat(actor.getMovies()).containsOnly(movieBack);
        assertThat(movieBack.getActors()).containsOnly(actor);

        actor.setMovies(new HashSet<>());
        assertThat(actor.getMovies()).doesNotContain(movieBack);
        assertThat(movieBack.getActors()).doesNotContain(actor);
    }
}
