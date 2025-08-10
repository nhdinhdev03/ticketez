package com.ticketez_backend_springboot.modules.actor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ActorDAO extends JpaRepository<Actor, Long> {
   @Query("SELECT o FROM Actor o WHERE o.fullname LIKE CONCAT('%', :keyword, '%') ")
    Page<Actor> findByKeyword(@Param("keyword") String search, Pageable pageable);

    // @Query("SELECT a FROM Actor a ORDER BY a.id DESC")
    List<Actor> findAllByOrderByIdDesc();
}
