package com.ticketez_backend_springboot.modules.movieProducer;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class MovieProducerPK implements Serializable {
    @Column(name = "movie_id", insertable = false, updatable = false)
    private Long movieId;
    @Column(name = "producer_id", insertable = false, updatable = false)
    private Long producerId;

}
