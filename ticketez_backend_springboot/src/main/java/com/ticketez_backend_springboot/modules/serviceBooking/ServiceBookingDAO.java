package com.ticketez_backend_springboot.modules.serviceBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceBookingDAO extends JpaRepository<ServiceBooking, ServiceBookingPK> {

}
