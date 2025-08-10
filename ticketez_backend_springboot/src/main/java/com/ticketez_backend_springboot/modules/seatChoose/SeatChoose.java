package com.ticketez_backend_springboot.modules.seatChoose;

import java.time.LocalDateTime;

import com.ticketez_backend_springboot.modules.account.Account;
import com.ticketez_backend_springboot.modules.seat.Seat;
import com.ticketez_backend_springboot.modules.showtime.Showtime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Seats_Choose")
@Data
public class SeatChoose {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private LocalDateTime lastSelectedTime;
	@ManyToOne
	@JoinColumn(name = "seat_id")
	private Seat seat;

	@ManyToOne
	@JoinColumn(name = "showtime_id")
	private Showtime showtime;

	@ManyToOne
	@JoinColumn(name = "account_id")
	private Account account;

}