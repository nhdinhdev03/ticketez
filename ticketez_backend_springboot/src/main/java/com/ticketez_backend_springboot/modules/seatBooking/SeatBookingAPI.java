package com.ticketez_backend_springboot.modules.seatBooking;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@Configuration
@EnableScheduling
@RequestMapping("/api/seatBooking")
public class SeatBookingAPI {
    @Autowired
    SeatBookingDao bookingDao;

    @GetMapping
    public ResponseEntity<List<SeatBooking>> findAll() {
        return ResponseEntity.ok(bookingDao.findAll());
    }

    // @GetMapping("status-seatchart/{seatChartID}/{status}")
    // public ResponseEntity<List<String>> findByStatus(@PathVariable("seatChartID")
    // long id,
    // @PathVariable("status") Integer status) {
    // return ResponseEntity.ok(bookingDao.findSeatNamesBySeatChartIdAndStatus(id,
    // status));
    // }

    @GetMapping("/{id}")
    public ResponseEntity<SeatBooking> findById(@PathVariable("id") Long id) {
        if (!bookingDao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bookingDao.findById(id).get());
    }

    @GetMapping("by-booking/{id}")
    public ResponseEntity<List<SeatBooking>> findByBookingId(@PathVariable("id") String id) {
        return ResponseEntity.ok(bookingDao.findByBookingId(id));
    }

    @GetMapping("name-seat/{id}")
    public ResponseEntity<List<String>> findByIDseat(@PathVariable("id") String id) {
        return ResponseEntity.ok(bookingDao.findSeatNamesByBookingId(id));
    }

    @PostMapping
    public ResponseEntity<SeatBooking> post(@RequestBody SeatBooking seatBooking) {
        bookingDao.save(seatBooking);
        return ResponseEntity.ok(seatBooking);
    }

    // @Scheduled(fixedDelay = 60000)
    // public void checkAndDeleteBookedSeats() {
    // LocalDateTime currentTime = LocalDateTime.now();
    // List<SeatBooking> bookedSeats = bookingDao.findByStatus(2);
    // for (SeatBooking seat : bookedSeats) {
    // if (seat.getLastSelectedTime() != null) {
    // Duration duration = Duration.between(seat.getLastSelectedTime(),
    // currentTime);
    // if (duration.toMinutes() >= 1) {
    // bookingDao.deleteById(seat.getId());
    // ;
    // }
    // }
    // }
    // }

    @PutMapping("/{id}")
    public ResponseEntity<SeatBooking> put(@PathVariable("id") Long id, @RequestBody SeatBooking seatBooking) {
        if (!bookingDao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookingDao.save(seatBooking);
        return ResponseEntity.ok(seatBooking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") Long id) {
        bookingDao.deleteById(id);
        return ResponseEntity.ok(true);
    }


    @GetMapping("find-seat-booking-by-seat-char-id-and-showtime-id/{seatChartID}/{showTimeID}")
    public ResponseEntity<List<String>> findByStatus(
            @PathVariable("seatChartID") Long seatChartId,
            @PathVariable("showTimeID") Long showTimeId) {
        return ResponseEntity.ok(bookingDao.findSeatNamesByShowtimeAndSeatChart(showTimeId, seatChartId));
    }
}
