package com.ticketez_backend_springboot.modules.movieStudio;

import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.studio.Studio;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "Movies_Studios")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MovieStudio {
    @EmbeddedId
    MovieStudioPK movieStudioPK;

    @ManyToOne
    @JoinColumn(name = "movie_id", insertable = false, updatable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "studio_id", insertable = false, updatable = false)
    private Studio studio;

}
