package com.ticketez_backend_springboot.modules.movie;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ticketez_backend_springboot.dto.TotalDashboardAdmin;
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplex;

@Repository
public interface MovieDAO extends JpaRepository<Movie, Long> {
        @Query("SELECT o FROM Movie o WHERE o.title LIKE CONCAT('%', :keyword, '%') ")
        Page<Movie> findByKeyword(@Param("keyword") String search, Pageable pageable);

        @Query("SELECT m FROM Movie m WHERE EXISTS"
                        + "(SELECT st FROM Showtime st WHERE m.id = st.formatMovie.movie.id "
                        + "AND st.startTime >= CURRENT_TIMESTAMP "
                        + "AND CAST(st.startTime AS DATE) = :date "
                        + "AND st.cinema.cinemaComplex = :CinemaComplex "
                        + ")")
        List<Movie> getMoviesByCinemaComplex(@Param("CinemaComplex") CinemaComplex CinemaComplex,
                        @Param("date") LocalDate date);

        List<Movie> findAllByOrderByIdDesc();

        @Query("SELECT m FROM Movie m WHERE EXISTS "
                        + "(SELECT st FROM Showtime st WHERE m.id = st.formatMovie.movie.id "
                        + "AND CAST(CURRENT_TIMESTAMP AS DATE) BETWEEN  CAST(st.startTime AS DATE) AND  CAST(st.endTime AS DATE)  )")
        List<Movie> getMoviesExistsMovieIdShowtimes();

        @Query("SELECT DISTINCT m " +
                        "FROM Movie m " +
                        "JOIN m.formatsMovies fm " +
                        "JOIN ( " +
                        "    SELECT fm.id AS formatMovieId, MAX(s.endTime) AS maxEndTime " +
                        "    FROM Showtime s " +
                        "    JOIN s.formatMovie fm " +
                        "    WHERE " +
                        "     CAST(s.endTime AS DATE) = CAST(CURRENT_DATE AS DATE) " +
                        "    GROUP BY fm.id " +
                        ") maxShowtimes ON fm.id = maxShowtimes.formatMovieId " +
                        "JOIN Showtime s ON s.formatMovie.id = fm.id AND s.endTime = maxShowtimes.maxEndTime")
        List<Movie> getMovieByShowtimeShowing();

        @Query(value = "SELECT DISTINCT m.* " +
                        "FROM Movies m " +
                        "JOIN Formats_Movies fm ON fm.movie_id = m.id " +
                        "JOIN ( " +
                        "    SELECT fm.movie_id, MAX(s.end_time) AS max_end_time " +
                        "    FROM Showtimes s " +
                        "    JOIN Formats_Movies fm ON s.format_movie_id = fm.id " +
                        "    WHERE  s.end_time > DATEADD(day, 1, CONVERT(DATE, GETDATE()))  " +
                        "      AND s.end_time < DATEADD(day, 10, CONVERT(DATE, GETDATE()))  " +
                        "    GROUP BY fm.movie_id " +
                        ") max_showtimes ON fm.movie_id = max_showtimes.movie_id " +
                        "JOIN Showtimes s ON s.format_movie_id = fm.id AND s.end_time = max_showtimes.max_end_time", nativeQuery = true)
        List<Movie> getMovieByShowtimeUpcoming();

        // Lấy ra top 5 phim có booking cao nhất
        @Query("SELECT b.showtime.formatMovie.movie " +
                        "FROM Booking b " +
                        "GROUP BY b.showtime.formatMovie.movie " +
                        "ORDER BY COUNT(b.id) DESC")

        List<Movie> findTop5MoviesWithMostBookings();

        @Query(value = "SELECT DISTINCT m.* " +
                        "FROM Movies m " +
                        "JOIN Formats_Movies fm ON fm.movie_id = m.id " +
                        "JOIN ( " +
                        "    SELECT fm.movie_id, MAX(s.end_time) AS max_end_time " +
                        "    FROM Showtimes s " +
                        "    JOIN Formats_Movies fm ON s.format_movie_id = fm.id " +
                        "    WHERE CONVERT(DATE, s.end_time) >= CONVERT(DATE, GETDATE()) " +
                        "        AND CONVERT(DATE, s.start_time) <= CONVERT(DATE, GETDATE()) " +
                        "    GROUP BY fm.movie_id " +
                        ") max_showtimes ON fm.movie_id = max_showtimes.movie_id " +
                        "JOIN Showtimes s ON s.format_movie_id = fm.id AND s.end_time = max_showtimes.max_end_time " +
                        "JOIN Genres_Movies gm ON gm.movie_id = m.id " +
                        "WHERE gm.genre_id = :genresID " +
                        "ORDER BY m.id; " +
                        "", nativeQuery = true)
        List<Movie> getMovieByShowtimeShowingByGenres(@Param("genresID") Long genresID);

        @Query("SELECT m FROM Movie m JOIN m.genresMovies.genre g" +
                        " WHERE EXISTS"
                        + "(SELECT st FROM Showtime st WHERE m.id = st.formatMovie.movie.id "
                        + "AND st.startTime >= CURRENT_TIMESTAMP "
                        + ") AND "
                        + "g.name  LIKE CONCAT('%', :genreName, '%') "
                        + "AND m.country  LIKE CONCAT('%', :country, '%') "
                        + "AND YEAR(m.releaseDate)  LIKE CONCAT('%', :year, '%') "
                        + "AND m.title LIKE CONCAT('%', :search, '%') GROUP BY m   ")
        Page<Movie> findMovieByGenreAndCountryAndSearch(@Param("genreName") String genreName,
                        @Param("country") String country,
                        @Param("year") String year,
                        @Param("search") String search,
                        Pageable pageable);

        // đổ những bộ phim hiện tại có suất chiếu và đổ lên từ cao tới thấp theo rating
        @Query("SELECT m FROM Movie m JOIN m.genresMovies.genre g WHERE EXISTS"
                        + "(SELECT st FROM Showtime st WHERE m.id = st.formatMovie.movie.id "
                        + "AND st.startTime >= CURRENT_TIMESTAMP "
                        + ") ORDER BY m.rating DESC")
        Page<Movie> findMovieShowtimePresent(Pageable pageable);

        @Query("SELECT m FROM Movie m WHERE EXISTS"
                        + "(SELECT st FROM Showtime st WHERE m.id = st.formatMovie.movie.id "
                        + "AND st.startTime >= CURRENT_TIMESTAMP "
                        + ") "
                        + "AND NOT EXISTS "
                        + "(SELECT b FROM Booking b JOIN b.showtime st WHERE m.id = st.formatMovie.movie.id AND b.status = 0 AND b.ticketStatus = 1 "
                        + "AND  b.account.id = :userId   )"
                        + "ORDER BY m.rating DESC")
        Page<Movie> findMovieShowtimePresentNotExistsByUser(Pageable pageable, String userId);

        @Query("SELECT new com.ticketez_backend_springboot.dto.TotalDashboardAdmin( " +
                        " COUNT( k.id) AS total_tickets ) " +
                        " FROM Booking k " +
                        " WHERE k.ticketStatus = 1")
        List<TotalDashboardAdmin> getTotalTickets();

        @Query("SELECT new com.ticketez_backend_springboot.dto.TotalDashboardAdmin( " +
                        " COUNT( m.id) AS total_movies ) " +
                        " FROM Movie m ")
        List<TotalDashboardAdmin> getTotalMovies();

}