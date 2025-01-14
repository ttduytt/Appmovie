package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PermissionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Permission getPermissionSample1() {
        return new Permission().id(1L).name("name1").description("description1");
    }

    public static Permission getPermissionSample2() {
        return new Permission().id(2L).name("name2").description("description2");
    }

    public static Permission getPermissionRandomSampleGenerator() {
        return new Permission()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString());
    }
}
