package com.ticketez_backend_springboot.modules.movieStudio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * MovieStudioDAO
 */
@Repository
public interface MovieStudioDAO extends JpaRepository<MovieStudio, MovieStudioPK> {

}