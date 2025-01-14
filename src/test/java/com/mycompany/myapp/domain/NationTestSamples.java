package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class NationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Nation getNationSample1() {
        return new Nation().id(1L).name("name1");
    }

    public static Nation getNationSample2() {
        return new Nation().id(2L).name("name2");
    }

    public static Nation getNationRandomSampleGenerator() {
        return new Nation().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString());
    }
}
