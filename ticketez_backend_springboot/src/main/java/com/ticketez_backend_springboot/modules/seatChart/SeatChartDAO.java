package com.ticketez_backend_springboot.modules.seatChart;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ticketez_backend_springboot.modules.cinema.Cinema; 


public interface  SeatChartDAO extends JpaRepository<SeatChart,Long> {
    

    List <SeatChart> findByCinemaId(Long CinemaID);

    
    @Query("SELECT s FROM SeatChart s JOIN s.cinema c WHERE s.cinema = :cinema AND s.status = true")
    List<SeatChart> getSeatChartsByCinema(@Param("cinema") Cinema cinema);
    List<SeatChart> findByName(String name);
}
