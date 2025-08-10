package com.ticketez_backend_springboot.modules.cinema;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplex;

public interface CinemaDAO extends JpaRepository<Cinema, Long> {

  List<Cinema> findByCinemaComplexId(Long cinemaComplexId);

  @Query("SELECT DISTINCT c FROM Cinema c join" +
      "  SeatChart s" +
      "  on s.cinema.id = c.id WHERE c.cinemaComplex = :cinemaComplex and s.status = true")
  List<Cinema> getCinemaByCinemaComplex(@Param("cinemaComplex") CinemaComplex cinemaComplex);

  @Query("SELECT c FROM Cinema c WHERE c.cinemaComplex = :cinemaComplex")
  Page<Cinema> getCinemaByCinemaComplexID(Pageable pageable, @Param("cinemaComplex") CinemaComplex cinemaComplex);

}
