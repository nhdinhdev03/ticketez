package com.ticketez_backend_springboot.modules.cinemaChain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketez_backend_springboot.dto.CinemaChainBookingDTO;
import com.ticketez_backend_springboot.dto.PriceSeatTypeDTO;
import com.ticketez_backend_springboot.modules.booking.Booking;
import com.ticketez_backend_springboot.modules.booking.BookingDAO;
import com.ticketez_backend_springboot.modules.paymentInfo.PaymentInfo;
import com.ticketez_backend_springboot.modules.paymentInfo.PaymentInfoDAO;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/cinemaChain")

public class CinemaChainAPI {
    @Autowired
    CinemaChainDao cinemaChainDao;
    @Autowired
    private BookingDAO bookingDao;
    @Autowired
    private PaymentInfoDAO dao;
    // @GetMapping
    // public ResponseEntity<List<CinemaChain>> findAll() {
    // return ResponseEntity.ok(cinemaChainDao.findAllByOrderByIdDesc());
    // }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") Long id) {
        try {
            if (!cinemaChainDao.existsById(id)) {
                return new ResponseEntity<>("Không tìm thấy rạp", HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(cinemaChainDao.findById(id).get());
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/get/all")
    public ResponseEntity<List<CinemaChain>> findAll() {
        List<CinemaChain> cinemaChains = cinemaChainDao.findAllByOrderByIdDesc();
        return ResponseEntity.ok(cinemaChains);
    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody CinemaChain cinemaChain) {
        try {
            cinemaChainDao.save(cinemaChain);
            return ResponseEntity.ok(cinemaChain);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(@PathVariable("id") Long id, @RequestBody CinemaChain cinemaChain) {
        try {
            if (!cinemaChainDao.existsById(id)) {
                return new ResponseEntity<>("Rạp không tồn tại", HttpStatus.NOT_FOUND);
            }
            cinemaChainDao.save(cinemaChain);
            return ResponseEntity.ok(cinemaChain);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            cinemaChainDao.deleteById(id);
            return ResponseEntity.ok().body("Xoá cụm rạp thành công");
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xóa", HttpStatus.CONFLICT);
        }

    }

    @GetMapping("/cinemaChainBookingDTO")
    public ResponseEntity<List<CinemaChainBookingDTO>> findAllCinemaChainAndBookingDTO() {
        List<CinemaChain> cinemaChains = cinemaChainDao.findAll();
        List<CinemaChainBookingDTO> rspList = new ArrayList<>();
        for (CinemaChain cinemaChain : cinemaChains) {
            List<PaymentInfo> paymentss = new ArrayList<>();
            CinemaChainBookingDTO bookingDTO = new CinemaChainBookingDTO();

            List<Booking> bookings = bookingDao.findBookingsByCinemaChainId(cinemaChain.getId());
            for (Booking booking : bookings) {
                PaymentInfo payment = dao.findByBookingId(booking.getId());
                if (payment != null) {
                    paymentss.add(payment);
                }

            }
            float totalPrice = (float) paymentss.stream()
                    .filter(payment -> payment != null && payment.getAmount() != null)
                    .mapToDouble(PaymentInfo::getAmount)
                    .sum();

            bookingDTO.setCinemaChain(cinemaChain);
            bookingDTO.setBookings(bookings);
            bookingDTO.setPayments(paymentss);
            bookingDTO.setTotalPrice(totalPrice);

            rspList.add(bookingDTO);
        }

        return ResponseEntity.ok(rspList);

    }

}
