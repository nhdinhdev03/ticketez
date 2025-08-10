package com.ticketez_backend_springboot.modules.discount;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountDao extends JpaRepository<Discount, Long> {
    List<Discount> findAllByOrderByIdDesc();

}
