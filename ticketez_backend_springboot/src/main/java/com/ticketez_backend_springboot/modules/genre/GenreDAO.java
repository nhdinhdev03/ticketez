package com.ticketez_backend_springboot.modules.genre;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ticketez_backend_springboot.modules.movie.Movie;

@Repository
public interface GenreDAO extends JpaRepository<Genre, Long> {
    @Query("SELECT o FROM Genre o WHERE o.name LIKE CONCAT('%', :keyword, '%') ")
    Page<Genre> findByKeyword(@Param("keyword") String search, Pageable pageable);

    @Query("SELECT g FROM Genre g JOIN g.genresMovies gm JOIN gm.movie m WHERE m = :movie")
    List<Genre> getGenreByMovie(@Param("movie") Movie movie);

}
