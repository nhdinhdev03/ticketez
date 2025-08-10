package com.ticketez_backend_springboot.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ticketez_backend_springboot.auth.models.SecurityERole;
import com.ticketez_backend_springboot.auth.models.SecurityRole;

public interface RoleRepository extends JpaRepository<SecurityRole, Long> {
    Optional<SecurityRole> findByName(SecurityERole name);

}