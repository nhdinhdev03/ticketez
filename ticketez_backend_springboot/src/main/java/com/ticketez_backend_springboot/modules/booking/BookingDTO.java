package com.ticketez_backend_springboot.modules.booking;

import java.util.List;

import com.ticketez_backend_springboot.modules.seat.Seat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    // Booking booking;
    // List<Seat> seats;
    // List<SeatTypePriceDTO> listPrice;
    Double total;
    String bookingId;
    String showtimeId;
    String accountId;
}
