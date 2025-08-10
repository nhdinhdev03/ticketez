package com.ticketez_backend_springboot.modules.movie;

import java.io.Serializable;
import java.sql.Time;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.actorMovie.ActorMovie;
import com.ticketez_backend_springboot.modules.directorMovie.DirectorMovie;
import com.ticketez_backend_springboot.modules.formatMovie.FormatMovie;
import com.ticketez_backend_springboot.modules.genreMovie.GenreMovie;
import com.ticketez_backend_springboot.modules.movieProducer.MovieProducer;
import com.ticketez_backend_springboot.modules.movieStudio.MovieStudio;
import com.ticketez_backend_springboot.modules.mpaaRating.MPAARating;

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
@Table(name = "Movies")
@Data
public class Movie implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;
	private String description;

	private String poster;
	private String banner;
	private Time duration;
	@Column(name = "release_date")
	@Temporal(TemporalType.DATE)
	private Date releaseDate;
	private String country;
	private Float rating;
	@Column(name = "video_trailer")
	private String videoTrailer;

	// @ManyToOne
	// @JoinColumn(name = "movie_studio_id")
	// private Studio movieStudio;

	// @ManyToOne
	// @JoinColumn(name = "movie_producer_id")
	// private Producer movieProducer;

	@ManyToOne
	@JoinColumn(name = "MPAA_rating_id")
	private MPAARating mpaaRating;

	@JsonIgnore
	@OneToMany(mappedBy = "movie")
	private List<GenreMovie> genresMovies;

	@JsonIgnore
	@OneToMany(mappedBy = "movie")
	private List<FormatMovie> formatsMovies;

	@JsonIgnore
	@OneToMany(mappedBy = "movie")
	private List<DirectorMovie> directorsMovies;

	@JsonIgnore
	@OneToMany(mappedBy = "movie")
	private List<ActorMovie> actorsMovies;

	@JsonIgnore
	@OneToMany(mappedBy = "movie")
	private List<MovieProducer> moviesProducers;

	@JsonIgnore
	@OneToMany(mappedBy = "movie")
	private List<MovieStudio> moviesStudios;
}