package com.ticketez_backend_springboot.modules.cinemaType;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/cinemaType")

public class CinemaTypeAPI {
    @Autowired
    CinemaTypeDAO cinemaTypeDAO;

    @GetMapping
    public ResponseEntity<List<CinemaType>> findAll() {
        return ResponseEntity.ok(cinemaTypeDAO.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") Long id) {
        try {
            if (!cinemaTypeDAO.existsById(id)) {
                return new ResponseEntity<>("Không tìm thấy rạp", HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(cinemaTypeDAO.findById(id).get());
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody CinemaType cinemaType) {
        try {
            cinemaTypeDAO.save(cinemaType);
            return ResponseEntity.ok(cinemaType);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(@PathVariable("id") Long id, @RequestBody CinemaType cinemaType) {
        try {
            if (!cinemaTypeDAO.existsById(id)) {
                return new ResponseEntity<>("Rạp không tồn tại", HttpStatus.NOT_FOUND);
            }
            cinemaTypeDAO.save(cinemaType);
            return ResponseEntity.ok(cinemaType);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            cinemaTypeDAO.deleteById(id);
            return ResponseEntity.ok().body("Xoá rạp thành công");
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xóa", HttpStatus.CONFLICT);
        }

    }
}
