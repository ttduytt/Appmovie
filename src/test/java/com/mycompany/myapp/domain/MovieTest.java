package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ActorTestSamples.*;
import static com.mycompany.myapp.domain.CommentTestSamples.*;
import static com.mycompany.myapp.domain.MovieTestSamples.*;
import static com.mycompany.myapp.domain.NationTestSamples.*;
import static com.mycompany.myapp.domain.TopicTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class MovieTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Movie.class);
        Movie movie1 = getMovieSample1();
        Movie movie2 = new Movie();
        assertThat(movie1).isNotEqualTo(movie2);

        movie2.setId(movie1.getId());
        assertThat(movie1).isEqualTo(movie2);

        movie2 = getMovieSample2();
        assertThat(movie1).isNotEqualTo(movie2);
    }

    @Test
    void commentsTest() {
        Movie movie = getMovieRandomSampleGenerator();
        Comment commentBack = getCommentRandomSampleGenerator();

        movie.addComments(commentBack);
        assertThat(movie.getComments()).containsOnly(commentBack);
        assertThat(commentBack.getMovie()).isEqualTo(movie);

        movie.removeComments(commentBack);
        assertThat(movie.getComments()).doesNotContain(commentBack);
        assertThat(commentBack.getMovie()).isNull();

        movie.comments(new HashSet<>(Set.of(commentBack)));
        assertThat(movie.getComments()).containsOnly(commentBack);
        assertThat(commentBack.getMovie()).isEqualTo(movie);

        movie.setComments(new HashSet<>());
        assertThat(movie.getComments()).doesNotContain(commentBack);
        assertThat(commentBack.getMovie()).isNull();
    }

    @Test
    void nationTest() {
        Movie movie = getMovieRandomSampleGenerator();
        Nation nationBack = getNationRandomSampleGenerator();

        movie.setNation(nationBack);
        assertThat(movie.getNation()).isEqualTo(nationBack);

        movie.nation(null);
        assertThat(movie.getNation()).isNull();
    }

    @Test
    void actorsTest() {
        Movie movie = getMovieRandomSampleGenerator();
        Actor actorBack = getActorRandomSampleGenerator();

        movie.addActors(actorBack);
        assertThat(movie.getActors()).containsOnly(actorBack);

        movie.removeActors(actorBack);
        assertThat(movie.getActors()).doesNotContain(actorBack);

        movie.actors(new HashSet<>(Set.of(actorBack)));
        assertThat(movie.getActors()).containsOnly(actorBack);

        movie.setActors(new HashSet<>());
        assertThat(movie.getActors()).doesNotContain(actorBack);
    }

    @Test
    void topicsTest() {
        Movie movie = getMovieRandomSampleGenerator();
        Topic topicBack = getTopicRandomSampleGenerator();

        movie.addTopics(topicBack);
        assertThat(movie.getTopics()).containsOnly(topicBack);

        movie.removeTopics(topicBack);
        assertThat(movie.getTopics()).doesNotContain(topicBack);

        movie.topics(new HashSet<>(Set.of(topicBack)));
        assertThat(movie.getTopics()).containsOnly(topicBack);

        movie.setTopics(new HashSet<>());
        assertThat(movie.getTopics()).doesNotContain(topicBack);
    }
}
