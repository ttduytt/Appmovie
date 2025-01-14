package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class MovieTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Movie getMovieSample1() {
        return new Movie()
            .id(1L)
            .movieName("movieName1")
            .author("author1")
            .view(1)
            .description("description1")
            .numberEpisode(1)
            .avatar("avatar1")
            .linkMovie("linkMovie1");
    }

    public static Movie getMovieSample2() {
        return new Movie()
            .id(2L)
            .movieName("movieName2")
            .author("author2")
            .view(2)
            .description("description2")
            .numberEpisode(2)
            .avatar("avatar2")
            .linkMovie("linkMovie2");
    }

    public static Movie getMovieRandomSampleGenerator() {
        return new Movie()
            .id(longCount.incrementAndGet())
            .movieName(UUID.randomUUID().toString())
            .author(UUID.randomUUID().toString())
            .view(intCount.incrementAndGet())
            .description(UUID.randomUUID().toString())
            .numberEpisode(intCount.incrementAndGet())
            .avatar(UUID.randomUUID().toString())
            .linkMovie(UUID.randomUUID().toString());
    }
}
