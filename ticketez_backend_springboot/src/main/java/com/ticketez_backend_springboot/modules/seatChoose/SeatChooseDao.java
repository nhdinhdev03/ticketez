package com.ticketez_backend_springboot.modules.seatChoose;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ticketez_backend_springboot.modules.account.Account;

import jakarta.transaction.Transactional;

@Repository
public interface SeatChooseDao extends JpaRepository<SeatChoose, Long> {

    @Query("SELECT sb.seat.name FROM SeatChoose sb WHERE sb.seat.seatChart.id = :seatChartId AND sb.showtime.id = :showTimeId")
    List<String> findSeatNamesBySeatChartIdAndShowTimeId(@Param("seatChartId") Long seatChartId,
            @Param("showTimeId") Long showTimeId);

    @Transactional
    @Modifying
    @Query("DELETE FROM SeatChoose s WHERE s IN :seatChooseList")
    void deleteAllByIdIn(@Param("seatChooseList") List<SeatChoose> seatChooseList);

    List<SeatChoose> findByAccount(Account account);

    List<SeatChoose> findByShowtimeIdAndAccountId(Long showtimeId, String accountId);
}
