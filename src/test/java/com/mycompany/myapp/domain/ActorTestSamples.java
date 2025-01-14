package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ActorTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Actor getActorSample1() {
        return new Actor().id(1L).name("name1").age(1);
    }

    public static Actor getActorSample2() {
        return new Actor().id(2L).name("name2").age(2);
    }

    public static Actor getActorRandomSampleGenerator() {
        return new Actor().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).age(intCount.incrementAndGet());
    }
}
