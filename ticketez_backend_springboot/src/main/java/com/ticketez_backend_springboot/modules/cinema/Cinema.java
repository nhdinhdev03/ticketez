
package com.ticketez_backend_springboot.modules.cinema;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplex;
import com.ticketez_backend_springboot.modules.cinemaType.CinemaType;
import com.ticketez_backend_springboot.modules.seatChart.SeatChart;
import com.ticketez_backend_springboot.modules.showtime.Showtime;

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
@Table(name = "Cinemas")
@Data
public class Cinema {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	private boolean status;

	@ManyToOne
	@JoinColumn(name = "cinema_type_id")
	private CinemaType cinemaType;

	@ManyToOne
	@JoinColumn(name = "cinema_complex_id")
	private CinemaComplex cinemaComplex;

	@JsonIgnore
	@OneToMany(mappedBy = "cinema")
	private List<SeatChart> seatCharts;

	@JsonIgnore
	@OneToMany(mappedBy = "cinema")
	private List<Showtime> showtimes;
}