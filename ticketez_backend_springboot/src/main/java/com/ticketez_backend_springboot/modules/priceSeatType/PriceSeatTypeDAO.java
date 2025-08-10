package com.ticketez_backend_springboot.modules.priceSeatType;

import org.springframework.stereotype.Repository;

import com.ticketez_backend_springboot.modules.seatChoose.SeatChoose;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface PriceSeatTypeDAO extends JpaRepository<PriceSeatType, Long> {
    List<PriceSeatType> findByPriceId(Long priceId);

    @Modifying
    @Query("DELETE FROM PriceSeatType s WHERE s.id IN :priceSeatTypeIds")
    void deleteAllByIdIn(@Param("priceSeatTypeIds") List<Long> priceSeatTypeIds);

}
