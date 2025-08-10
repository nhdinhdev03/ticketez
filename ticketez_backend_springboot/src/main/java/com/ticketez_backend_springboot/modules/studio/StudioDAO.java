package com.ticketez_backend_springboot.modules.studio;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudioDAO extends JpaRepository<Studio, Long> {
    @Query("SELECT m FROM Studio m WHERE m.name LIKE CONCAT('%', :keyword, '%') ")
    Page<Studio> findByKeyword(@Param("keyword") String search, Pageable pageable);

}
