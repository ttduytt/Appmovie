package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class CommentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Comment getCommentSample1() {
        return new Comment().id(1L).name("name1").content("content1").like(1);
    }

    public static Comment getCommentSample2() {
        return new Comment().id(2L).name("name2").content("content2").like(2);
    }

    public static Comment getCommentRandomSampleGenerator() {
        return new Comment()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .content(UUID.randomUUID().toString())
            .like(intCount.incrementAndGet());
    }
}
