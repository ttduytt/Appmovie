package com.mycompany.myapp.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisPublisherService {

    private final RedisTemplate<String, String> redisTemplate;
    private final String redisChanel;

    public RedisPublisherService(RedisTemplate<String, String> redisTemplate, String redisChanel) {
        this.redisTemplate = redisTemplate;
        this.redisChanel = redisChanel;
    }

    public void sendMessage(String message) {
        redisTemplate.convertAndSend(redisChanel, message);
    }
}
