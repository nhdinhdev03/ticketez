package com.ticketez_backend_springboot.modules.serviceChoose;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketez_backend_springboot.modules.serviceBooking.ServiceBooking;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/service-choose")
public class ServiceChooseAPI {
    @Autowired
    ServiceChooseDAO serviceChooseDAO;

    @PostMapping("/create-list")
    public ResponseEntity<?> post(@RequestBody List<ServiceChoose> serviceChooses) {
        if (serviceChooses == null) {
            return new ResponseEntity<>("Lỗi, Không tìm thấy ghế đã chọn", HttpStatus.BAD_REQUEST);
        }
        serviceChooseDAO.saveAll(serviceChooses);
        return ResponseEntity.status(HttpStatus.OK).body(serviceChooses);
    }
}
