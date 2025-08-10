
package com.ticketez_backend_springboot.modules.directorMovie;

import com.ticketez_backend_springboot.modules.director.Director;
import com.ticketez_backend_springboot.modules.movie.Movie;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Directors_Movies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DirectorMovie {
	@EmbeddedId
	DirectorMoviePK directorMoviePK;

	@ManyToOne
	@JoinColumn(name = "director_id", insertable = false, updatable = false)
	private Director director;

	@ManyToOne
	@JoinColumn(name = "movie_id", insertable = false, updatable = false)
	private Movie movie;
}