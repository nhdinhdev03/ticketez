package com.ticketez_backend_springboot.modules.serviceChoose;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceChooseDAO extends JpaRepository<ServiceChoose, Long> {
    List<ServiceChoose> findByAccountId(String accountId);
}
