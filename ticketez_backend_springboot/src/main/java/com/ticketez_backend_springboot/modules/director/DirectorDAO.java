package com.ticketez_backend_springboot.modules.director;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DirectorDAO extends JpaRepository<Director, Long> {
    List<Director> findAllByOrderByIdDesc();
   
    @Query("SELECT o FROM Director o WHERE o.fullname LIKE CONCAT('%', :keyword, '%') ")
    Page<Director> findByKeyword(@Param("keyword") String search, Pageable pageable);

}
