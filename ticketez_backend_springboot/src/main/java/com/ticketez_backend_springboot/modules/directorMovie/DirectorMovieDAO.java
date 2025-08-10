package com.ticketez_backend_springboot.modules.directorMovie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface DirectorMovieDAO extends JpaRepository<DirectorMovie, DirectorMoviePK> {
    
}
