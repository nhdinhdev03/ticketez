package com.ticketez_backend_springboot.modules.movieProducer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieProducerDAO extends JpaRepository<MovieProducer, MovieProducerPK> {

}
