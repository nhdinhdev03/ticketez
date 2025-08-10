package com.ticketez_backend_springboot.modules.discountBooking;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
@RequestMapping("/api/discountsBookings")
public class DiscountsBookingAPI {

	@Autowired
	private DiscountsBookingDAO discountsBookingRepository;

	@GetMapping
	public ResponseEntity<Page<DiscountsBooking>> getAll(Pageable pageable) {
		Page<DiscountsBooking> discountsBookings = discountsBookingRepository.findAll(pageable);
		return ResponseEntity.ok(discountsBookings);
	}

	@GetMapping("/{bookingId}/{serviceId}")
	public ResponseEntity<DiscountsBooking> getOne(@PathVariable("bookingId") Long bookingId,
			@PathVariable("serviceId") Long serviceId) {
		Optional<DiscountsBooking> discountsBookingOptional = discountsBookingRepository
				.findById(new DiscountsBookingPK(bookingId, serviceId));
		if (discountsBookingOptional.isPresent()) {
			return ResponseEntity.ok(discountsBookingOptional.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@PostMapping
	public ResponseEntity<DiscountsBooking> post(@RequestBody DiscountsBooking discountsBooking) {
		if (discountsBooking == null) {
			return ResponseEntity.badRequest().body(null);
		}
		discountsBookingRepository.save(discountsBooking);
		return ResponseEntity.status(HttpStatus.CREATED).body(discountsBooking);
	}

	@PutMapping("/{bookingId}/{serviceId}")
	public ResponseEntity<DiscountsBooking> put(@PathVariable("bookingId") Long bookingId,
			@PathVariable("serviceId") Long serviceId, @RequestBody DiscountsBooking discountsBooking) {
		if (discountsBooking == null) {
			return ResponseEntity.badRequest().body(null);
		}
		if (discountsBookingRepository.existsById(new DiscountsBookingPK(bookingId, serviceId))) {
			discountsBookingRepository.save(discountsBooking);
			return ResponseEntity.ok(discountsBooking);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@DeleteMapping("/{bookingId}/{serviceId}")
	public ResponseEntity<Void> delete(@PathVariable("bookingId") Long bookingId,
			@PathVariable("serviceId") Long serviceId) {
		if (discountsBookingRepository.existsById(new DiscountsBookingPK(bookingId, serviceId))) {
			discountsBookingRepository.deleteById(new DiscountsBookingPK(bookingId, serviceId));
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
}
