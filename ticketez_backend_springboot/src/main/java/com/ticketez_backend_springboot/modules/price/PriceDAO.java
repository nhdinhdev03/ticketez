package com.ticketez_backend_springboot.modules.price;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PriceDAO extends JpaRepository<Price, Long> {

        // @Query("SELECT p FROM Price p WHERE p.seatType.id IN (:ids) AND "
        // + "p.cinemaComplex.id = :cinemaClxId AND p.movie.id = :movieId "
        // + " AND p.status = true")
        // List<Price> getPriceListBySeatTypeIds(
        // @Param("ids") List<Long> ids,
        // @Param("cinemaClxId") Long cinemaClxId,
        // @Param("movieId") Long movieId);

        List<Price> findAllByOrderByStartDateDesc();
        // // lấy price theo cinemacomplexId và movieID

        // Trong interface PriceDAO
        List<Price> findByCinemaComplexIdAndFormatMovie_Movie_Id(Long cinemaComplexId, Long movieId);
        List<Price> findByShowtimesId(Long showtimeId);
        @Query("select p from Price p  " +
                        " join FormatMovie fm " +
                        " on p.formatMovie.id = fm.id  " +
                        " join Movie m  " +
                        " on m.id = fm.movie.id " +
                        " join Format f  " +
                        " on f.id = fm.format.id " +
                        " where m.id = :movieId " +
                        " and f.id = :formatId " +
                        " and p.cinemaComplex.id = :cinemaComplexId  " +
                        " and (CAST(:date AS DATE) BETWEEN CAST(p.startDate AS DATE)  AND CAST(p.endDate AS DATE))")
        List<Price> getPriceByMovieAndCinemaComplexAndDate(@Param("movieId") Long movieId,
                  @Param("formatId") Long formatId, @Param("cinemaComplexId") Long cinemaComplexId, @Param("date") LocalDate date);

}
