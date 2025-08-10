package com.ticketez_backend_springboot.modules.articleMovie;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/articleMovie")
public class ArticleMovieAPI {

    @Autowired
    ArticleMovieDAO dao;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<ArticleMovie> genreMovie = dao.findAll();
        return ResponseEntity.ok(genreMovie);
    }

    @GetMapping("/get/movie-by-article/{articleId}")
    public ResponseEntity<?> getMovieByArticle(@PathVariable("articleId") Long articleId) {
        try {
            List<ArticleMovie> movie = dao.getMovieByArticle(articleId);
            return ResponseEntity.ok(movie);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
