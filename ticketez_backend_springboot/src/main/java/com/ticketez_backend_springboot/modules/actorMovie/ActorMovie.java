package com.ticketez_backend_springboot.modules.actorMovie;

import com.ticketez_backend_springboot.modules.actor.Actor;
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
@Table(name = "Actors_Movies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActorMovie {

	@EmbeddedId
	ActorMoviePK actorMoviePK;

	@ManyToOne
	@JoinColumn(name = "actor_id", insertable = false, updatable = false)
	private Actor actor;

	@ManyToOne
	@JoinColumn(name = "movie_id", insertable = false, updatable = false)
	private Movie movie;
}