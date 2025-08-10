package com.ticketez_backend_springboot.modules.genreMovie;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/genreMovie")
public class GenreMovieAPI {

    @Autowired
    GenreMovieDAO dao;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<GenreMovie> genreMovie = dao.findAll();
        return  ResponseEntity.ok(genreMovie);
    }
    
}
