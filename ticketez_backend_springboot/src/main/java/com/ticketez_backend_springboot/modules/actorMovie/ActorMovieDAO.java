package com.ticketez_backend_springboot.modules.actorMovie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ActorMovieDAO extends JpaRepository<ActorMovie, ActorMoviePK> {

}