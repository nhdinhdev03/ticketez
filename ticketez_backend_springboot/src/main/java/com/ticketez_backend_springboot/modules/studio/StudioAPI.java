package com.ticketez_backend_springboot.modules.studio;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
@CrossOrigin("*")
@RequestMapping("/api/studio")
public class StudioAPI {
    @Autowired
    StudioDAO dao;
    private final Logger logger = LoggerFactory.getLogger(Studio.class);

    @GetMapping
    public ResponseEntity<?> findAll(
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit,
            @RequestParam("search") Optional<String> search) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Tài nguyên không tồn tại",
                        HttpStatus.BAD_REQUEST);
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));

            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10),
                    sort);
            Page<Studio> page = dao.findByKeyword(search.orElse(""), pageable);
            ResponseDTO<Studio> responeDTO = new ResponseDTO<>();
            responeDTO.setData(page.getContent());
            responeDTO.setTotalItems(page.getTotalElements());
            responeDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responeDTO);
        } catch (Exception e) {
            logger.error("[find all] - error: ", e.toString());
            return new ResponseEntity<>("Lỗi kết nối server",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/get/all")
    public ResponseEntity<?> findAll() {
        try {
            List<Studio> list = dao.findAll();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") Long id) {
        try {
            if (!dao.existsById(id)) {
                return new ResponseEntity<>("Dữ liệu không tồn tại", HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(dao.findById(id).get());
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi tìm kiếm dữ liệu", HttpStatus.CONFLICT);
        }

    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody Studio movieStudio) {
        try {
            dao.save(movieStudio);
            return ResponseEntity.ok(movieStudio);
        } catch (Exception e) {
            logger.error("[Create] - error:", e.toString());
            return new ResponseEntity<>("Không thể thêm dữ liệu mới", HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(@PathVariable("id") Long id, @RequestBody Studio movieStudio) {
        try {
            if (!dao.existsById(id)) {
                return new ResponseEntity<>("Không tìm thấy dữ liệu", HttpStatus.NOT_FOUND);
            }
            dao.save(movieStudio);
            return ResponseEntity.ok(movieStudio);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi cập nhật dữ liệu", HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {

        try {
            Studio studioDb = dao.findById(id).orElse(null);

            if (studioDb == null) {
                return new ResponseEntity<>("Không thể xoá, không tìm thấy hãng phim", HttpStatus.NOT_FOUND);
            }
            if (!studioDb.getMovieStudios().isEmpty()) {
                return new ResponseEntity<>("Không thể xoá, thông tin hãng phim đã được thêm vào phim",
                        HttpStatus.CONFLICT);
            }
            dao.deleteById(id);
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            logger.error("[Delete] - error: ", e.toString());
            return new ResponseEntity<>("Không thể xoá, có lỗi trong việc xóa", HttpStatus.CONFLICT);
        }

    }

}
