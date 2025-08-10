package com.ticketez_backend_springboot.modules.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookingHistoryDTO {
    private String paymentId;
    private Booking booking;

}
