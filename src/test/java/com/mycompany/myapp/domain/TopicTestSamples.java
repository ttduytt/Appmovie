package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TopicTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Topic getTopicSample1() {
        return new Topic().id(1L).name("name1");
    }

    public static Topic getTopicSample2() {
        return new Topic().id(2L).name("name2");
    }

    public static Topic getTopicRandomSampleGenerator() {
        return new Topic().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString());
    }
}
