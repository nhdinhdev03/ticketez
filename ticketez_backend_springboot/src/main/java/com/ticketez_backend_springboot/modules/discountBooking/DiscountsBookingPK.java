package com.ticketez_backend_springboot.modules.discountBooking;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Setter
@Getter
public class DiscountsBookingPK implements Serializable {

	@Column(name = "discount_id", insertable = false, updatable = false)
	private Long discountID;

	@Column(name = "booking_id", insertable = false, updatable = false)
	private Long bookingID;

	public DiscountsBookingPK(Long discountID, Long bookingID) {
		super();
		this.discountID = discountID;
		this.bookingID = bookingID;
	}

}