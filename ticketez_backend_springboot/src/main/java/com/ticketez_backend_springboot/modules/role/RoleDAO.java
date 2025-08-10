package com.ticketez_backend_springboot.modules.role;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ticketez_backend_springboot.modules.review.Review;

public interface RoleDAO extends JpaRepository<Role, Long> {
    List<Role> findAllByOrderByIdDesc();
}
