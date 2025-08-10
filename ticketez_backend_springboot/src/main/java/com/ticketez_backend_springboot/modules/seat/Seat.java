package com.ticketez_backend_springboot.modules.seat;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.seatBooking.SeatBooking;
import com.ticketez_backend_springboot.modules.seatChart.SeatChart;
import com.ticketez_backend_springboot.modules.seatChoose.SeatChoose;
import com.ticketez_backend_springboot.modules.seatType.SeatType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Seats")
@Data
public class Seat {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	private Boolean status;
	private String description;

	@ManyToOne
	@JoinColumn(name = "seat_type_id")
	private SeatType seatType;

	@ManyToOne
	@JoinColumn(name = "seat_chart_id")
	private SeatChart seatChart;

	@JsonIgnore
	@OneToMany(mappedBy = "seat")
	private List<SeatBooking> seatsBookings;

	@JsonIgnore
	@OneToMany(mappedBy = "seat")
	private List<SeatChoose> seatsChooses;
}