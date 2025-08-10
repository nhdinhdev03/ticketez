
package com.ticketez_backend_springboot.modules.formatMovie;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ticketez_backend_springboot.modules.format.Format;
import com.ticketez_backend_springboot.modules.movie.Movie;

@Repository
public interface FormatMovieDAO extends JpaRepository<FormatMovie, Long> {
    @Query("SELECT DISTINCT f.movie FROM FormatMovie f ")
    List<Movie> getDistinctMovie();

    FormatMovie findByFormatAndMovie(Format format, Movie movie);

    @Query("SELECT DISTINCT f.format FROM FormatMovie f where f.movie = :movieId")
    List<Format> getDistinctFormats(@Param("movieId") Movie movieId);

    // lấy id của formatmovie dựa theo id của movie và format
    @Query("SELECT f FROM FormatMovie f WHERE f.movie = :movieId AND f.format = :formatId")
    List<FormatMovie> getIdFoMatMvoie(@Param("movieId") Movie movieId, @Param("formatId") Format formatId);

    @Query("SELECT fm FROM FormatMovie fm WHERE fm.format.id = :formatId")
    List<FormatMovie> findByFormatId(@Param("formatId") Long formatId);

    @Query(value = "select fm.* from Formats_Movies fm " + 
            " join Movies m on fm.movie_id = m.id " + 
            " where format_id = :movieId " + 
            " order by m.rating desc",nativeQuery =  true )
    List<FormatMovie> getMoviesByGenre(@Param("movieId") Long movieId);
}
