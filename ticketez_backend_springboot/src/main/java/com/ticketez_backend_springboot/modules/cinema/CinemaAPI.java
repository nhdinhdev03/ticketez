package com.ticketez_backend_springboot.modules.cinema;

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
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplex;
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplexDao;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/cinema")
public class CinemaAPI {

    @Autowired
    CinemaDAO cinemaDAO;

    @Autowired
    CinemaComplexDao cinemaComplexDAO;

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Cinema> page = cinemaDAO.findAll(pageable);
            ResponseDTO<Cinema> responseDTO = new ResponseDTO<>();
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
            if (!cinemaDAO.existsById(id)) {
                return new ResponseEntity<>("Không tìm thấy rạp", HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(cinemaDAO.findById(id).get());
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("by-cinema-complex/{idCinemacomplex}")
    public ResponseEntity<?> findCinemaByCinemaComplex(@PathVariable("idCinemacomplex") Long id) {
        try {
            if (!cinemaDAO.existsById(id)) {
                return new ResponseEntity<>("Không tìm thấy rạp", HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(cinemaDAO.findByCinemaComplexId(id));
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody Cinema cinema) {
        try {
            cinemaDAO.save(cinema);
            return ResponseEntity.ok(cinema);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(@PathVariable("id") Long id, @RequestBody Cinema cinema) {
        try {
            if (!cinemaDAO.existsById(id)) {
                return new ResponseEntity<>("Rạp không tồn tại", HttpStatus.NOT_FOUND);
            }
            cinemaDAO.save(cinema);
            return ResponseEntity.ok(cinema);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            cinemaDAO.deleteById(id);
            return ResponseEntity.ok().body("Xoá rạp thành công");
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xóa", HttpStatus.CONFLICT);
        }

    }

    // ----------------------------------------------------------------
    @GetMapping("/get/cinema-by-cinemaComplex/{cinemaComplexId}")
    public ResponseEntity<?> getDuLie(@PathVariable("cinemaComplexId") long cinemaComplexId) {
        try {
            // if (cinemaComplexId) {
            // return new ResponseEntity<>("Lỗi ", HttpStatus.NOT_FOUND);
            // }
            CinemaComplex complex = cinemaComplexDAO.findById(cinemaComplexId).get();
            if (complex != null) {
                List<Cinema> cinema = cinemaDAO.getCinemaByCinemaComplex(complex);
                return ResponseEntity.ok(cinema);
            }
            return new ResponseEntity<>("Lỗi ", HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/get/cinema-by-cinemaComplexId")
    public ResponseEntity<?> getCinemaByCinemaComplexId(
            @RequestParam("cinemaComplexId") long cinemaComplexId,
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            CinemaComplex complex = cinemaComplexDAO.findById(cinemaComplexId).get();
            if (complex != null) {
                Sort sort = Sort.by(Sort.Order.desc("id"));
                Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
                Page<Cinema> page = cinemaDAO.getCinemaByCinemaComplexID(pageable, complex);
                ResponseDTO<Cinema> responseDTO = new ResponseDTO<>();
                responseDTO.setData(page.getContent());
                responseDTO.setTotalItems(page.getTotalElements());
                responseDTO.setTotalPages(page.getTotalPages());
                return ResponseEntity.ok(responseDTO);
            }
            return new ResponseEntity<>("Lỗi ", HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
