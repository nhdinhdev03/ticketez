package com.ticketez_backend_springboot.modules.verification;

import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/verification")
public class VerificationAPI {
    
    @Autowired
    VerificationDAO verificationDAO;

    @GetMapping
    public ResponseEntity<List<Verification>> findAll( ) {
        return ResponseEntity.ok(verificationDAO.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Verification> findById(@PathVariable("id") Integer id) {
        if (!verificationDAO.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(verificationDAO.findById(id).get());
    }

    @PostMapping
    public ResponseEntity<Verification> post(@RequestBody Verification verification) {
        verificationDAO.save(verification);
        return ResponseEntity.ok(verification);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Verification> put(@PathVariable("id") Integer id, @RequestBody Verification verification) {
        if (!verificationDAO.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        verificationDAO.save(verification);
        return ResponseEntity.ok(verification);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") Integer id) {
        verificationDAO.deleteById(id);
        return ResponseEntity.ok(true);
    }

}
