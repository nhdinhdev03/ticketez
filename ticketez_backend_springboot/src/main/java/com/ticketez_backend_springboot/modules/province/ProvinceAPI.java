package com.ticketez_backend_springboot.modules.province;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.ticketez_backend_springboot.dto.CinemaComplexToProvinceDTO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/province")
public class ProvinceAPI {
    @Autowired
    ProvinceDao provinceDao;

    @GetMapping
    public ResponseEntity<List<Province>> findAll() {
        return ResponseEntity.ok(provinceDao.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Province> findById(@PathVariable("id") Long id) {
        if (!provinceDao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(provinceDao.findById(id).get());
    }

    @PostMapping
    public ResponseEntity<Province> post(@RequestBody Province province) {
        provinceDao.save(province);
        return ResponseEntity.ok(province);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Province> put(@PathVariable("id") Long id, @RequestBody Province province) {
        if (!provinceDao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        provinceDao.save(province);
        return ResponseEntity.ok(province);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") Long id) {
        provinceDao.deleteById(id);
        return ResponseEntity.ok(true);
    }

    //
    @GetMapping("/get/province-by-name")
    public ResponseEntity<List<Province>> findAllByNameLike(@RequestParam("name") Optional<String> name) {

        return ResponseEntity.ok(provinceDao.findAllByNameLike(name.orElse("")));

    }

    // hiển thị tổng cinemacomplex theo province
    @GetMapping("/getTotalCinemaComplexToPrivince")
    public ResponseEntity<?> getTotalCinemaComplexToPrivince() {
        List<CinemaComplexToProvinceDTO> distinctMovieIds = provinceDao.getTotalCinemaComplexToPrivince();
        return ResponseEntity.ok(distinctMovieIds);
    }
}
