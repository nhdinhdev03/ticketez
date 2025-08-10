package com.ticketez_backend_springboot.modules.producer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProducerDAO extends JpaRepository<Producer, Long> {
    @Query("SELECT o FROM Producer o WHERE o.name LIKE CONCAT('%', :keyword,'%') ")
    Page<Producer> findByKeyword(@Param("keyword") String search, Pageable pageable);
}
