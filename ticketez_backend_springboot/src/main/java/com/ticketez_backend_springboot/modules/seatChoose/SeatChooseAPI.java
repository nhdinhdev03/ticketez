package com.ticketez_backend_springboot.modules.seatChoose;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketez_backend_springboot.modules.account.Account;
import com.ticketez_backend_springboot.modules.serviceChoose.ServiceChoose;
import com.ticketez_backend_springboot.modules.serviceChoose.ServiceChooseDAO;

@CrossOrigin("*")
@RestController
@Configuration
@EnableScheduling
@RequestMapping("/api/seat-choose")
public class SeatChooseAPI {
    @Autowired
    SeatChooseDao dao;

    @Autowired
    ServiceChooseDAO serviceChooseDAO;

    @GetMapping
    public ResponseEntity<List<SeatChoose>> findAll() {
        return ResponseEntity.ok(dao.findAll());
    }

    @GetMapping("find-seat-choose-by-seat-char-id-and-showtime-id/{seatChartID}/{showTimeID}")
    public ResponseEntity<List<String>> findByStatus(
            @PathVariable("seatChartID") Long seatChartId,
            @PathVariable("showTimeID") Long showTimeId) {
        return ResponseEntity.ok(dao.findSeatNamesBySeatChartIdAndShowTimeId(seatChartId, showTimeId));
    }

    @PostMapping
    public ResponseEntity<List<SeatChoose>> post(@RequestBody List<SeatChoose> seats) {
        dao.saveAll(seats);
        return ResponseEntity.ok(seats);
    }

    @PostMapping("/deleteMultiple")
    public ResponseEntity<Void> deleteMultiple(@RequestBody List<SeatChoose> seatChooseList) {
        dao.deleteAllByIdIn(seatChooseList);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/deleteSeatChoose-ServiceChooseByAcc")
    public ResponseEntity<?> deleteMultiple(@RequestBody Account account) {
        List<SeatChoose> seatChoose = dao.findByAccount(account);
        List<ServiceChoose> serviceChooses = serviceChooseDAO.findByAccountId(account.getId());

        try {
            if (seatChoose != null) {
                dao.deleteAllById(seatChoose.stream().map(sc -> sc.getId()).collect(Collectors.toList()));

            }
            if (serviceChooses != null) {
                serviceChooseDAO
                        .deleteAllById(serviceChooses.stream().map(svc -> svc.getId()).collect(Collectors.toList()));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.noContent().build();
    }

    @Scheduled(fixedDelay = 60000)
    public void checkAndDeleteBookedSeats() {
        LocalDateTime currentTime = LocalDateTime.now();
        List<SeatChoose> seatChooses = dao.findAll();
        for (SeatChoose seat : seatChooses) {
            if (seat.getLastSelectedTime() != null) {
                Duration duration = Duration.between(seat.getLastSelectedTime(), currentTime);
                if (duration.toMinutes() >= 5) {
                    dao.deleteById(seat.getId());
                }
            }
        }
    }
}
