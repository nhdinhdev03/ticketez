package com.ticketez_backend_springboot.modules.paymentInfo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentInfoDAO extends JpaRepository<PaymentInfo, String> {
    PaymentInfo findByBookingId(String bookingId);
}
