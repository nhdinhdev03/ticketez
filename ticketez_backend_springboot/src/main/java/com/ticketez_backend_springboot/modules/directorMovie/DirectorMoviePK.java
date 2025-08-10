package com.ticketez_backend_springboot.modules.directorMovie;
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
public class DirectorMoviePK implements Serializable {
    
	@Column(name = "director_id", insertable = false, updatable = false)
	private Long directorId;

	@Column(name = "movie_id", insertable = false, updatable = false)
	private Long movieId;
	
}
