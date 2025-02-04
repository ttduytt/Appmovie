package com.mycompany.myapp.config;

import com.mycompany.myapp.service.MessageSubscriber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfiguration {

    @Value("6379")
    private String redisPort;

    @Value("localhost")
    private String redisHost;

    @Bean
    public RedisMessageListenerContainer container(
        RedisConnectionFactory connectionFactory,
        MessageListenerAdapter messageListener1,
        MessageListenerAdapter messageListener2
    ) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        // đây là code để 1 sucriber lắng nghe message(có thể điều chỉnh thành 2 sucribe lắng nghe 1 message)
        container.addMessageListener(messageListener1, new PatternTopic(redisChanel()));
        container.addMessageListener(messageListener2, new PatternTopic(redisChanel()));

        return container;
    }

    @Bean
    public MessageListenerAdapter messageListener1(MessageSubscriber receiver1) {
        return new MessageListenerAdapter(receiver1, "receiverMessage");
    }

    @Bean
    public MessageListenerAdapter messageListener2(MessageSubscriber receiver2) {
        return new MessageListenerAdapter(receiver2, "receiverMessageactor");
    }

    @Bean
    public String redisChanel() {
        return "exampleApp";
    }

    // cấu hình RedisTemplate
    @Bean
    JedisConnectionFactory jedisConnectionFactory() {
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(redisHost);
        redisStandaloneConfiguration.setPort(Integer.parseInt(redisPort));

        return new JedisConnectionFactory(redisStandaloneConfiguration);
    }

    @Bean
    RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();

        redisTemplate.setConnectionFactory(jedisConnectionFactory());

        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());

        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        return redisTemplate;
    }
}
