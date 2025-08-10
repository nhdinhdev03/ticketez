package com.ticketez_backend_springboot.modules.format;

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
import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.movie.MovieDAO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/format")
public class FormatAPI {
    @Autowired
    FormatDAO dao;
    @Autowired
    MovieDAO daoMovie;

    @GetMapping
    public ResponseEntity<?> findByPage(
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit,
            @RequestParam("search") Optional<String> search) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Tài nguyên không tồn tại", HttpStatus.BAD_REQUEST);
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Format> page = dao.findByKeyword(search.orElse(""),pageable);
            ResponseDTO<Format> responeDTO = new ResponseDTO<>();
            responeDTO.setData(page.getContent());
            responeDTO.setTotalItems(page.getTotalElements());
            responeDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responeDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/get/all")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(dao.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Format> findById(@PathVariable("id") Long id) {
        if (!dao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dao.findById(id).get());
    }

    @PostMapping
    public ResponseEntity<Format> post(@RequestBody Format format) {
        dao.save(format);
        return ResponseEntity.ok(format);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Format> put(@PathVariable("id") Long id, @RequestBody Format format) {
        if (!dao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dao.save(format);
        return ResponseEntity.ok(format);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            dao.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xóa diễn viên do tài liệu tham khảo hiện có", HttpStatus.CONFLICT);
        }

    }

    // --------------------------------

    @GetMapping("/get/format-by-movie/{movieId}")
    public ResponseEntity<?> getFormatByMovie(@PathVariable("movieId") Long movieId) {
        try {
            if (movieId.equals("")) {
                return new ResponseEntity<>("Lỗi ", HttpStatus.NOT_FOUND);
            }
            Movie movie = daoMovie.findById(movieId).get();
            
            if (movie != null) {
                List<Format> format = dao.getFormatByMovie(movie);
                return ResponseEntity.ok(format);
            }
            return new ResponseEntity<>("Lỗi ", HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    

}
