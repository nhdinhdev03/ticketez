package com.ticketez_backend_springboot.modules.genreMovie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface GenreMovieDAO extends JpaRepository<GenreMovie, GenreMoviePK>{
    
}
