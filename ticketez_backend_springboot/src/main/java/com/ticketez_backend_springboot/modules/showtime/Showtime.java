package com.ticketez_backend_springboot.modules.showtime;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.booking.Booking;
import com.ticketez_backend_springboot.modules.cinema.Cinema;
import com.ticketez_backend_springboot.modules.formatMovie.FormatMovie;
import com.ticketez_backend_springboot.modules.price.Price;
import com.ticketez_backend_springboot.modules.seatChart.SeatChart;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Entity
@Table(name = "Showtimes")
@Data
public class Showtime {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "start_time")
	private Date startTime;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "end_time")
	private Date endTime;

	// private Integer status;

	@ManyToOne
	@JoinColumn(name = "format_movie_id")
	private FormatMovie formatMovie;

	@ManyToOne
	@JoinColumn(name = "cinema_id")
	private Cinema cinema;

	@JsonIgnore
	@OneToMany(mappedBy = "showtime")
	private List<Booking> bookings;

	@ManyToOne
	@JoinColumn(name = "seat_chart_id")
	private SeatChart seatChart;

	@ManyToOne
	@JoinColumn(name = "price_id")
	private Price price;

}