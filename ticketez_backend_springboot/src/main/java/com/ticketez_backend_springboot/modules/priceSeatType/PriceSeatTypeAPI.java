package com.ticketez_backend_springboot.modules.priceSeatType;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ticketez_backend_springboot.modules.price.Price;
import com.ticketez_backend_springboot.modules.priceSeatType.PriceSeatType;
import com.ticketez_backend_springboot.modules.seatChoose.SeatChoose;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/price_seat_type")
public class PriceSeatTypeAPI {
    @Autowired
    PriceSeatTypeDAO dao;

    @GetMapping
    public ResponseEntity<List<PriceSeatType>> findAll() {
        return ResponseEntity.ok(dao.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<PriceSeatType>> findbyIdprice(@PathVariable("id") Long id) {
        List<PriceSeatType> priceSeatTypes = dao.findByPriceId(id);
        return ResponseEntity.ok(priceSeatTypes);
    }

    @PostMapping
    public ResponseEntity<List<PriceSeatType>> post(@RequestBody List<PriceSeatType> priceSeatTypes) {
        dao.saveAll(priceSeatTypes);
        return ResponseEntity.ok(priceSeatTypes);
    }

    @PostMapping("/deleteMultiple")
    public ResponseEntity<Boolean> deleteMultiple(@RequestBody List<Long> ids) {

        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest().body(false);
        }

        for (Long id : ids) {
            dao.deleteById(id);
        }

        return ResponseEntity.ok(true);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") Long id) {
        dao.deleteById(id);
        return ResponseEntity.ok(true);
    }

}
