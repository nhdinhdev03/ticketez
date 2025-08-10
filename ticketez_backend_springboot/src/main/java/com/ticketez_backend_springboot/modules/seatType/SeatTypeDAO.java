package com.ticketez_backend_springboot.modules.seatType;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SeatTypeDAO extends JpaRepository<SeatType, Long> {

    List<SeatType> findAllByOrderByIdDesc();

    @Query("SELECT DISTINCT st FROM SeatType st JOIN st.seats s WHERE s.seatChart.id = :seatChartId")
    List<SeatType> findSeatTypesBySeatChartId(@Param("seatChartId") Long seatChartId);

    @Query("SELECT st FROM SeatType st " +
            "JOIN st.seats s " +
            "JOIN s.seatChart sc " +
            "JOIN sc.cinema c " +
            "WHERE c.cinemaComplex.id = :cinemaComplexId")
    List<SeatType> findSeatTypesByCinemaComplexId(@Param("cinemaComplexId") Long cinemaComplexId);

}
