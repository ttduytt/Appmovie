package com.mycompany.myapp.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.domain.Movie;
import com.mycompany.myapp.repository.MovieRepository;
import jakarta.transaction.Transactional;
import java.util.*;
import java.util.concurrent.TimeUnit;
import org.springframework.data.redis.connection.DataType;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RedisMovieService {

    private final RedisTemplate<String, String> redisTemplate;
    private final HashOperations<String, String, String> hashOperations;
    private final MovieRepository movieRepository;
    private final ObjectMapper objectMapper;

    public RedisMovieService(ObjectMapper objectMapper, RedisTemplate<String, String> redisTemplate, MovieRepository movieRepository) {
        this.redisTemplate = redisTemplate;
        this.hashOperations = redisTemplate.opsForHash();
        this.movieRepository = movieRepository;
        this.objectMapper = objectMapper;
    }

    // khai báo các key redis làm việc với movie
    private static final String REDIS_MOVIE_VIEW_KEY_PREFIX = "movie:view";
    private static final String REDIS_MOVIE_PROGRESS_KEY_PREFIX = "movie:progress:";
    private static final String MOVIE_HASH = "MovieHash";
    private static final String MOVIE_KEYWORD_SEARCH = "search_history:";

    // lưu dữ liệu view vào redis
    public void saveViewInRedis(List<Movie> movies) {
        String redisKey = REDIS_MOVIE_VIEW_KEY_PREFIX;
        for (Movie movie : movies) {
            redisTemplate.opsForZSet().add(redisKey, movie.getId().toString(), movie.getView());
        }
    }

    // cập nhật view trong redis
    public void updateViewInRedis(Long movieId) {
        redisTemplate.boundZSetOps(REDIS_MOVIE_VIEW_KEY_PREFIX).incrementScore(movieId.toString(), 1);
    }

    // lấy 10 top view trong redis
    public List<Movie> getTopMoviesByViews(int limit) {
        List<Movie> movies = new ArrayList<>();
        List<ZSetOperations.TypedTuple<String>> ListMovie = redisTemplate
            .opsForZSet()
            .reverseRangeWithScores(REDIS_MOVIE_VIEW_KEY_PREFIX, 0, limit - 1)
            .stream()
            .toList();

        if (!ListMovie.isEmpty()) {
            for (ZSetOperations.TypedTuple<String> element : ListMovie) {
                movieRepository
                    .findById(Long.parseLong(element.getValue()))
                    .ifPresent(Movie -> {
                        Movie movie = Movie;
                        movie.setView(element.getScore().intValue());
                        movies.add(movie);
                    });
            }
        }

        return movies;
    }

    // lưu tiến trình xem phim với redis
    public String SaveProgressWatch(String idUser, String idMovie, int episode, int minute) {
        String redisKey = REDIS_MOVIE_PROGRESS_KEY_PREFIX + idUser;

        Map<String, Object> progressData = new HashMap<>();
        progressData.put("episode", episode);
        progressData.put("minute", minute);

        String progressDataJson = "";
        try {
            // Chuyển Map thành chuỗi JSON
            progressDataJson = objectMapper.writeValueAsString(progressData);

            // Lưu dữ liệu đã được serialize vào Redis
            redisTemplate.opsForHash().put(redisKey, idMovie, progressDataJson);
            return "Progress saved successfully!";
        } catch (Exception e) {
            // Ghi log lỗi nếu xảy ra sự cố
            e.printStackTrace();
            return "Failed to save progress: " + e.getMessage();
        }
    }

    // lấy trạng thái xem phim của 1 user
    public Object getProgressWatch(String userId, String movieId) {
        String redisKey = REDIS_MOVIE_PROGRESS_KEY_PREFIX + userId;

        Object progress = redisTemplate.opsForHash().get(redisKey, movieId);

        if (progress != null) {
            return progress;
        } else {
            return "No progress found for this movie.";
        }
    }

    // hàm đặt lịch chạy để đồng bộ dữ liệu view của movie trong redis với mysql
    @Scheduled(fixedRate = 3600000) // Execute every hour
    @Transactional
    public void syncViewsFromRedisToMySQL() {
        // Get all keys related to movie views from Redis
        for (String key : redisTemplate.keys(REDIS_MOVIE_VIEW_KEY_PREFIX + "*")) {
            // Extract movie ID from the key
            Long movieId = Long.parseLong(key.replace(REDIS_MOVIE_VIEW_KEY_PREFIX, ""));

            ValueOperations<String, String> valueOps = redisTemplate.opsForValue();
            int redisViewCount = Integer.parseInt(valueOps.get(key));

            // Fetch the movie entity from the database
            Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new RuntimeException("Movie not found for ID: " + movieId));

            // Update the view count in MySQL
            movie.setView(movie.getView() + redisViewCount);
            movieRepository.save(movie);

            // Remove the entry from Redis after syncing
            redisTemplate.delete(key);
        }
    }

    // lưu list movie vào redis
    public String cacheMovies(List<Movie> movies) {
        try {
            for (Movie movie : movies) {
                // lưu movieid: object movie
                String jsonmovie = objectMapper.writeValueAsString(movie);
                hashOperations.put(MOVIE_HASH, movie.getId().toString(), jsonmovie);
                redisTemplate.expire(MOVIE_HASH, 60, TimeUnit.MINUTES);

                String keywords = movie.getMovieName().toLowerCase();

                // Lưu từng từ khóa vào Redis
                redisTemplate.opsForSet().add(keywords, String.valueOf(movie.getId()));
                redisTemplate.expire(keywords, 60, TimeUnit.MINUTES);
            }
            return "luu movie vao redis thanh cong";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to save progress: " + e.getMessage();
        }
    }

    public String gettestgetcacheMovies() {
        String a = hashOperations.get(MOVIE_HASH, "1");
        return a;
    }

    //     Tìm kiếm các movie chứa từ khóa
    public List<Movie> findMoviesByKeyword(String keyword) {
        try {
            keyword = keyword.toLowerCase();

            Set<String> allKey = redisTemplate.keys("*");

            List<Movie> listMovie = new ArrayList<>();

            if (allKey != null) {
                for (String key : allKey) {
                    if (key.contains(keyword) && redisTemplate.type(key) == DataType.SET) {
                        Set<String> movieIds = redisTemplate.opsForSet().members(key);
                        if (movieIds != null) {
                            String movieId = movieIds.iterator().next();
                            String jsonmovie = hashOperations.get(MOVIE_HASH, movieId);
                            Movie movie = objectMapper.readValue(jsonmovie, Movie.class);
                            listMovie.add(movie);
                        }
                    }
                }
            }

            return listMovie;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to search movies: " + e.getMessage());
        }
    }

    // redis  Publisher
    public void publisher(String message) {
        redisTemplate.convertAndSend("new-movie", message);
    }

    // thêm dữ liệu vào lịch sử tìm kiếm
    public void addToSearchHistory(String userId, String keySearch) {
        String key = MOVIE_KEYWORD_SEARCH + userId;

        //nếu từ khóa tìm kiếm đang tồn tại trong ls tìm kiếm thì xóa giá trị cũ
        // nếu value không tồn tại thì ko có chuyện gì xảy ra
        redisTemplate.opsForList().remove(key, 0, keySearch);

        // mỗi khi người dùng tìm kiếm 1 từ khóa nào đó luôn đẩy nó lên đầu ds
        redisTemplate.opsForList().leftPush(key, keySearch);

        // Giới hạn danh sách không vượt quá số lượng tối đa là 10
        // nếu list ít hơn số dữ liệu trong lệnh trim thì list sẽ giữ nguyên
        redisTemplate.opsForList().trim(key, 0, 9);
    }

    // Lấy danh sách lịch sử
    public List<String> getSearchHistory(String userId) {
        String key = MOVIE_KEYWORD_SEARCH + userId;
        return redisTemplate.opsForList().range(key, 0, -1); // Lấy tất cả phần tử từ đầu đến cuối
    }

    // xóa 1 dữ liệu trong danh sách lịch sử
    public void deleteSearchHistory(String userId, String keySearch) {
        String key = MOVIE_KEYWORD_SEARCH + userId;
        redisTemplate.opsForList().remove(key, 0, keySearch);
    }
}
