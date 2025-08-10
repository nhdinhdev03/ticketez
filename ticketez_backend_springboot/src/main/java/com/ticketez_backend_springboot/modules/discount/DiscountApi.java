package com.ticketez_backend_springboot.modules.discount;

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
@RequestMapping("/api/discount")
public class DiscountApi {

    @Autowired
    DiscountDao dao;


    @GetMapping("/get/all")
    public ResponseEntity<List<Discount>> findAll() {
        List<Discount> discounts = dao.findAllByOrderByIdDesc();
        return ResponseEntity.ok(discounts);
    }

        @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Discount> page = dao.findAll(pageable);
            ResponseDTO<Discount> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
	public ResponseEntity<?> findById(@PathVariable("id") Long id) {
		try {
			if (!dao.existsById(id)) {
				return new ResponseEntity<>("Không tìm thấy", HttpStatus.NOT_FOUND);
			}
			return ResponseEntity.ok(dao.findById(id).get());
		} catch (Exception e) {
			return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PostMapping
	public ResponseEntity<?> post(@RequestBody Discount discount) {
		try {
			dao.save(discount);
			return ResponseEntity.ok(discount);
		} catch (Exception e) {
			return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

    @PutMapping("/{id}")
    public ResponseEntity<Discount> put(@PathVariable("id") Long id, @RequestBody Discount discount) {
        if (!dao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dao.save(discount);
        return ResponseEntity.ok(discount);
    }

	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") Long id) {
		try {
			dao.deleteById(id);
			return ResponseEntity.ok().build();
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<>("Không thể xóa giảm giá do tài liệu tham khảo hiện có", HttpStatus.CONFLICT);
		}

	}


}
