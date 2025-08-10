package com.ticketez_backend_springboot.modules.movieStudio;

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

public class MovieStudioPK implements Serializable {
    @Column(name = "movie_id", insertable = false, updatable = false)
    private Long movieId;
    @Column(name = "studio_id", insertable = false, updatable = false)
    private Long studioId;
}
