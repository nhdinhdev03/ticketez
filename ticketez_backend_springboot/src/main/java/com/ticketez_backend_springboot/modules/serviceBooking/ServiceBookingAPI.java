package com.ticketez_backend_springboot.modules.serviceBooking;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/servicebookings")
public class ServiceBookingAPI {

	@Autowired
	private ServiceBookingDAO serviceBookingRepository;

	@GetMapping
	public ResponseEntity<Page<ServiceBooking>> getAll(Pageable pageable) {
		Page<ServiceBooking> serviceBookings = serviceBookingRepository.findAll(pageable);
		return ResponseEntity.ok(serviceBookings);
	}

	@GetMapping("/{bookingId}/{serviceId}")
	public ResponseEntity<ServiceBooking> getOne(@PathVariable("bookingId") String bookingId,
			@PathVariable("serviceId") Long serviceId) {
		Optional<ServiceBooking> serviceBookingOptional = serviceBookingRepository
				.findById(new ServiceBookingPK(bookingId, serviceId));
		if (serviceBookingOptional.isPresent()) {
			return ResponseEntity.ok(serviceBookingOptional.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@PostMapping
	public ResponseEntity<ServiceBooking> post(@RequestBody ServiceBooking serviceBooking) {
		if (serviceBooking == null) {
			return ResponseEntity.badRequest().body(null);
		}
		serviceBookingRepository.save(serviceBooking);
		return ResponseEntity.status(HttpStatus.CREATED).body(serviceBooking);
	}

	@PutMapping("/{bookingId}/{serviceId}")
	public ResponseEntity<ServiceBooking> put(@PathVariable("bookingId") String bookingId,
			@PathVariable("serviceId") Long serviceId, @RequestBody ServiceBooking serviceBooking) {
		if (serviceBooking == null) {
			return ResponseEntity.badRequest().body(null);
		}
		if (serviceBookingRepository.existsById(new ServiceBookingPK(bookingId, serviceId))) {
			serviceBookingRepository.save(serviceBooking);
			return ResponseEntity.ok(serviceBooking);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@DeleteMapping("/{bookingId}/{serviceId}")
	public ResponseEntity<Void> delete(@PathVariable("bookingId") String bookingId,
			@PathVariable("serviceId") Long serviceId) {
		if (serviceBookingRepository.existsById(new ServiceBookingPK(bookingId, serviceId))) {
			serviceBookingRepository.deleteById(new ServiceBookingPK(bookingId, serviceId));
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
}
