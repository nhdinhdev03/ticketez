package com.ticketez_backend_springboot.modules.booking;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.account.Account;
import com.ticketez_backend_springboot.modules.discountBooking.DiscountsBooking;
import com.ticketez_backend_springboot.modules.paymentInfo.PaymentInfo;
import com.ticketez_backend_springboot.modules.seatBooking.SeatBooking;
import com.ticketez_backend_springboot.modules.serviceBooking.ServiceBooking;
import com.ticketez_backend_springboot.modules.showtime.Showtime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Booking")
@Data
public class Booking {
	@Id
	private String id;

	@ManyToOne
	@JoinColumn(name = "account_id")
	private Account account;

	@Column(name = "create_date")
	private Date createDate;

	@ManyToOne
	@JoinColumn(name = "showtime_id")
	private Showtime showtime;

	private Integer status;

	@Column(name = "ticket_status")
	private Integer ticketStatus;

	@OneToMany(mappedBy = "booking")
	@JsonIgnore
	private List<SeatBooking> seatsBookings;

	@OneToMany(mappedBy = "booking")
	@JsonIgnore
	private List<DiscountsBooking> discountsBookings;

	@OneToMany(mappedBy = "booking")
	@JsonIgnore
	private List<ServiceBooking> servicesBookings;

	@OneToMany(mappedBy = "booking")
	@JsonIgnore
	private List<PaymentInfo> paymentInfos;
}