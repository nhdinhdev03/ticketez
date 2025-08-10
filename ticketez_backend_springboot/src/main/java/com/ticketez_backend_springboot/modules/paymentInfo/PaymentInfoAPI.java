package com.ticketez_backend_springboot.modules.paymentInfo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment-info")
public class PaymentInfoAPI {

	@Autowired
	private PaymentInfoDAO dao;

	@GetMapping
	public ResponseEntity<List<PaymentInfo>> getAll() {
		List<PaymentInfo> paymentInfos = dao.findAll();
		return ResponseEntity.ok(paymentInfos);
	}

	@GetMapping("/{id}")
	public ResponseEntity<PaymentInfo> getOne(@PathVariable("id") String id) {
		Optional<PaymentInfo> paymentInfoOptional = dao.findById(id);
		if (paymentInfoOptional.isPresent()) {
			return ResponseEntity.ok(paymentInfoOptional.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@PostMapping
	public ResponseEntity<PaymentInfo> post(@RequestBody PaymentInfo paymentInfo) {
		if (paymentInfo == null) {
			return ResponseEntity.badRequest().body(null);
		}
		dao.save(paymentInfo);
		return ResponseEntity.status(HttpStatus.CREATED).body(paymentInfo);
	}

	@PutMapping("/{id}")
	public ResponseEntity<PaymentInfo> put(@PathVariable("id") String id, @RequestBody PaymentInfo paymentInfo) {
		if (paymentInfo == null) {
			return ResponseEntity.badRequest().body(null);
		}
		if (!dao.existsById(id)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
		dao.save(paymentInfo);
		return ResponseEntity.ok(paymentInfo);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") String id) {
		if (!dao.existsById(id)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
		dao.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
