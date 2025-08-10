package com.ticketez_backend_springboot.modules.mpaaRating;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ticketez_backend_springboot.dto.ResponseDTO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/mpaaRating")
public class MPAARatingAPI {

    @Autowired
    MPAARatingDAO mpaaRatingDAO;

    @GetMapping
    public ResponseEntity<ResponseDTO<MPAARating>> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return ResponseEntity.notFound().build();
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<MPAARating> page = mpaaRatingDAO.findAll(pageable);
            ResponseDTO<MPAARating> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/get/all")
    public ResponseEntity<?> findAll() {
        try {
            List<MPAARating> list = mpaaRatingDAO.findAll();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MPAARating> findById(@PathVariable("id") Long id) {
        try {
            if (!mpaaRatingDAO.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(mpaaRatingDAO.findById(id).get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<MPAARating> post(@RequestBody MPAARating mpaaRating) {
        try {
            mpaaRatingDAO.save(mpaaRating);
            return ResponseEntity.ok(mpaaRating);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MPAARating> put(@PathVariable("id") Long id, @RequestBody MPAARating mpaaRating) {
        try {
            if (!mpaaRatingDAO.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            mpaaRatingDAO.save(mpaaRating);
            return ResponseEntity.ok(mpaaRating);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            mpaaRatingDAO.deleteById(id);
            return ResponseEntity.ok().body("Xoá phân loại thành công");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Không thể xóa phân loại do tài liệu tham khảo hiện có");
        }

    }

}
