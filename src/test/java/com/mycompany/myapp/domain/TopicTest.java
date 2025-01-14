package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.MovieTestSamples.*;
import static com.mycompany.myapp.domain.TopicTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class TopicTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Topic.class);
        Topic topic1 = getTopicSample1();
        Topic topic2 = new Topic();
        assertThat(topic1).isNotEqualTo(topic2);

        topic2.setId(topic1.getId());
        assertThat(topic1).isEqualTo(topic2);

        topic2 = getTopicSample2();
        assertThat(topic1).isNotEqualTo(topic2);
    }

    @Test
    void moviesTest() {
        Topic topic = getTopicRandomSampleGenerator();
        Movie movieBack = getMovieRandomSampleGenerator();

        topic.addMovies(movieBack);
        assertThat(topic.getMovies()).containsOnly(movieBack);
        assertThat(movieBack.getTopics()).containsOnly(topic);

        topic.removeMovies(movieBack);
        assertThat(topic.getMovies()).doesNotContain(movieBack);
        assertThat(movieBack.getTopics()).doesNotContain(topic);

        topic.movies(new HashSet<>(Set.of(movieBack)));
        assertThat(topic.getMovies()).containsOnly(movieBack);
        assertThat(movieBack.getTopics()).containsOnly(topic);

        topic.setMovies(new HashSet<>());
        assertThat(topic.getMovies()).doesNotContain(movieBack);
        assertThat(movieBack.getTopics()).doesNotContain(topic);
    }
}
