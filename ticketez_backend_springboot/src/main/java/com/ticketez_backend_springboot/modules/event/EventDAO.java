package com.ticketez_backend_springboot.modules.event;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EventDAO extends JpaRepository<Event, Long> {

    // lấy sự kiện loại khuyến mãi
    @Query("SELECT e FROM Event e where e.typeEvent = 1 and e.status = true " +
            " and CURRENT_TIMESTAMP between CAST(e.startDate AS DATE) and CAST(e.endDate AS DATE) and e.status = true" +
            " order by e.id desc")
    List<Event> getEventByPromotion();

    // lấy sự kiện loại tin tức
    @Query("SELECT e FROM Event e where e.typeEvent = 0 and e.status = true " +
            " and CURRENT_TIMESTAMP between CAST(e.startDate AS DATE) and CAST(e.endDate AS DATE) and e.status = true" +
            " order by e.id desc")
    List<Event> getEventByNews();
}