package com.ticketez_backend_springboot.modules.serviceBooking;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Setter
@Getter
// @AllArgsConstructor
@NoArgsConstructor
public class ServiceBookingPK implements Serializable {
	@Column(name = "booking_id", insertable = false, updatable = false)
	private String bookingID;

	@Column(name = "service_id", insertable = false, updatable = false)
	private Long serviceID;

	// Thêm constructor chấp nhận hai tham số Long
	public ServiceBookingPK(String bookingID, Long serviceID) {
		this.bookingID = bookingID;
		this.serviceID = serviceID;
	}
}