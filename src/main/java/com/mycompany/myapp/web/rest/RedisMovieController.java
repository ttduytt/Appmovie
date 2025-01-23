//package com.mycompany.myapp.web.rest;
//
//import com.mycompany.myapp.repository.MovieRepository;
//import com.mycompany.myapp.service.RedisMovieService;
//import java.util.Collections;
//import java.util.List;
//import java.util.Map;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/dcm")
//public class RedisMovieController {
//
//    private final RedisMovieService redisMovieService;
//    private final MovieRepository movieRepository;
//
//    public RedisMovieController(RedisMovieService redisMovieService, MovieRepository movieRepository) {
//        this.redisMovieService = redisMovieService;
//        this.movieRepository = movieRepository;
//    }
//
//    @PostMapping("/{id}")
//    public ResponseEntity<String> updateView(@PathVariable("id") final String id) {
//        redisMovieService.incrementViewCount(id);
//        return ResponseEntity.ok("Movie ID: " + id);
//    }
//
//    @GetMapping("")
//    public ResponseEntity<List<Map<String, Object>>> getTopViewedMovies(@RequestParam(name = "topN", defaultValue = "10") int topN) {
//        try {
//            // Lấy danh sách các bộ phim từ Redis
//            List<Map<String, Object>> topMovies = redisMovieService.getTopViewedMovies(topN);
//
//            // Nếu không có dữ liệu từ Redis, lấy từ CSDL
//            if (topMovies == null || topMovies.isEmpty()) {
//                topMovies = movieRepository.getTopview(topN);
//            }
//
//            return ResponseEntity.ok(topMovies);
//        } catch (Exception e) {
//            // Xử lý lỗi
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
//        }
//    }
//}
