package com.mycompany.myapp.service;

import java.util.*;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

@Service
public class RedisMovieService {

    private final RedisTemplate<String, String> redisTemplate;
    private final HashOperations<String, String, Object> hashOperations;

    public RedisMovieService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.hashOperations = redisTemplate.opsForHash();
    }

    public void incrementViewCount(String movieId) {
        // Key cho ZSet lưu lượt xem
        String zsetKey = "movies:views";
        // Tăng lượt xem và cập nhật trong ZSet
        redisTemplate.opsForZSet().incrementScore(zsetKey, movieId, 1);
    }

    public List<Map<String, Object>> getTopViewedMovies(int topN) {
        // Key của ZSet
        String zsetKey = "movies:views";

        // Lấy topN bộ phim có lượt xem cao nhất
        Set<ZSetOperations.TypedTuple<String>> topMovies = redisTemplate.opsForZSet().reverseRangeWithScores(zsetKey, 0, topN - 1);

        // Biến đổi kết quả sang dạng danh sách Map
        List<Map<String, Object>> result = new ArrayList<>();
        if (topMovies != null) {
            for (ZSetOperations.TypedTuple<String> movie : topMovies) {
                Map<String, Object> movieData = new HashMap<>();
                movieData.put("movieId", movie.getValue());
                movieData.put("views", movie.getScore());
                result.add(movieData);
            }
        }
        return result;
    }

    public void deleteTopmovie() {
        redisTemplate.delete("movies:views");
    }
}
