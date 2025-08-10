package com.ticketez_backend_springboot.modules.formatMovie;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.format.Format;
import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.price.Price;
import com.ticketez_backend_springboot.modules.showtime.Showtime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Formats_Movies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormatMovie {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;

	@ManyToOne
	@JoinColumn(name = "format_id")
	private Format format;

	@ManyToOne
	@JoinColumn(name = "movie_id")
	private Movie movie;

	@JsonIgnore
	@OneToMany(mappedBy = "formatMovie")
	private List<Showtime> showtimes;

	@JsonIgnore
	@OneToMany(mappedBy = "formatMovie")
	private List<Price> prices;

}