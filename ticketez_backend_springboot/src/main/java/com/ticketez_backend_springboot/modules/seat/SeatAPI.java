package com.ticketez_backend_springboot.modules.seat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/seat")
public class SeatAPI {
    @Autowired
    private SeatDAO seatDAO;

    @GetMapping("/getAll")
    public ResponseEntity<List<Seat>> findAll() {
        List<Seat> seats = seatDAO.findAll();
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/by-seatchart/{seatChartId}")
    public ResponseEntity<List<Seat>> getSeatsBySeatChart(
            @PathVariable("seatChartId") Long seatChartId) {
        List<Seat> seats = seatDAO.findBySeatChartId(seatChartId);
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/by-seatchart-name/{seatChartId}/{name}")
    public ResponseEntity<Seat> getSeatsBySeatChartNameSeat(
            @PathVariable("seatChartId") Long seatChartId, @PathVariable("name") String name) {
        Seat seats = seatDAO.findBySeatChartIdAndName(seatChartId, name);
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/by-seatchart-and-seattype/{seatChartId}/{seatTypeId}")
    public ResponseEntity<List<Seat>> getSeatsBySeatChartAndSeatType(
            @PathVariable("seatChartId") Long seatChartId,
            @PathVariable("seatTypeId") Long seatTypeId) {
        List<Seat> seats = seatDAO.findBySeatChartIdAndSeatType_Id(seatChartId, seatTypeId);
        return ResponseEntity.ok(seats);
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<Seat> findById(@PathVariable("id") Long id) {
    // if (!seatDAO.existsById(id)) {
    // return ResponseEntity.notFound().build();
    // }
    // return ResponseEntity.ok(seatDAO.findById(id).get());
    // }

    @PostMapping
    public ResponseEntity<List<Seat>> post(@RequestBody List<Seat> seats) {
        seatDAO.saveAll(seats);
        return ResponseEntity.ok(seats);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Seat> put(@PathVariable("id") Long id, @RequestBody Seat seat) {
        if (!seatDAO.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        seatDAO.save(seat);
        return ResponseEntity.ok(seat);
    }

    @PutMapping("update")
    public ResponseEntity<List<Seat>> put(@RequestBody List<Seat> seats) {
        // Kiểm tra xem có tồn tại tất cả các id trong danh sách seats
        boolean allExist = seats.stream().allMatch(seat -> seatDAO.existsById(seat.getId()));

        if (!allExist) {
            return ResponseEntity.notFound().build();
        }

        seatDAO.saveAll(seats);
        return ResponseEntity.ok(seats);
    }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<Boolean> delete(@PathVariable("id") Long id) {
    // seatDAO.deleteById(id);
    // return ResponseEntity.ok(true);
    // }
}
