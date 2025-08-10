package com.ticketez_backend_springboot.modules.movieProducer;

import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.producer.Producer;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "Movies_Producers")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieProducer {
    @EmbeddedId
    MovieProducerPK movieProducerPK;

    @ManyToOne
    @JoinColumn(name = "movie_id", insertable = false, updatable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "producer_id", insertable = false, updatable = false)
    private Producer producer;
}
