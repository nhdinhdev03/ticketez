package com.ticketez_backend_springboot.modules.actorMovie;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ActorMoviePK implements Serializable {

    @Column(name = "actor_id", insertable = false, updatable = false)
    private Long actorId;

    @Column(name = "movie_id", insertable = false, updatable = false)
    private Long movieId;

    // public ActorMoviePK(Long actorId, Long movieId) {
    // this.actorId = actorId;
    // this.movieId = movieId;
    // }
}