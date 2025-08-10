
package com.ticketez_backend_springboot.modules.priceService;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ticketez_backend_springboot.modules.service.Service;

@Repository
public interface PriceServiceDAO extends JpaRepository<PriceService, Long> {
        List<PriceService> findAllByOrderByIdDesc();

        @Query("SELECT o FROM PriceService o WHERE o.service.id IN(:serverIds)" +
                        " AND CURRENT_DATE BETWEEN o.startDate AND o.endDate")
        List<PriceService> findByCplxAndService(
                        @Param("serverIds") List<Long> serverIds);
}
