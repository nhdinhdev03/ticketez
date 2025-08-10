package com.ticketez_backend_springboot.modules.event;

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
@RequestMapping("/api/event")
public class EventAPI {

    @Autowired
    private EventDAO eventDAO;

    @GetMapping
    public ResponseEntity<ResponseDTO<Event>> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return ResponseEntity.notFound().build();
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Event> page = eventDAO.findAll(pageable);
            ResponseDTO<Event> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> findById(@PathVariable("id") Long id) {

        try {
            if (!eventDAO.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(eventDAO.findById(id).get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Event> post(@RequestBody Event event) {
        try {
            eventDAO.save(event);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> put(@PathVariable("id") Long id, @RequestBody Event event) {
        try {
            if (!eventDAO.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            eventDAO.save(event);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        try {
            eventDAO.deleteById(id);
            return ResponseEntity.ok().body("Xoá sự kiện thành công");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Không thể xóa sự kiện do tài liệu tham khảo hiện có");
        }
    }


     //lấy event theo news
    @GetMapping("/get/event-by-promotion")
    public ResponseEntity<ResponseDTO<Event>> getEventByPromotion(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return ResponseEntity.notFound().build();
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);

            // Thực hiện truy vấn getEventByNews
            List<Event> newsEvents = eventDAO.getEventByPromotion();

            // Phân trang danh sách kết quả
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), newsEvents.size());
            List<Event> paginatedEvents = newsEvents.subList(start, end);

            // Tạo đối tượng ResponseDTO và cài đặt dữ liệu phản hồi
            ResponseDTO<Event> responseDTO = new ResponseDTO<>();
            responseDTO.setData(paginatedEvents);
            responseDTO.setTotalItems(Long.valueOf(newsEvents.size()));
            responseDTO.setTotalPages((int) Math.ceil((double) newsEvents.size() / (double) pageable.getPageSize()));

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    

    //lấy event theo news
    @GetMapping("/get/event-by-news")
    public ResponseEntity<ResponseDTO<Event>> getNewsEvents(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return ResponseEntity.notFound().build();
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);

            // Thực hiện truy vấn getEventByNews
            List<Event> newsEvents = eventDAO.getEventByNews();

            // Phân trang danh sách kết quả
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), newsEvents.size());
            List<Event> paginatedEvents = newsEvents.subList(start, end);

            // Tạo đối tượng ResponseDTO và cài đặt dữ liệu phản hồi
            ResponseDTO<Event> responseDTO = new ResponseDTO<>();
            responseDTO.setData(paginatedEvents);
            responseDTO.setTotalItems(Long.valueOf(newsEvents.size()));
            responseDTO.setTotalPages((int) Math.ceil((double) newsEvents.size() / (double) pageable.getPageSize()));

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}