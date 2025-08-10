package com.ticketez_backend_springboot.dto;

import java.util.List;

import com.ticketez_backend_springboot.modules.format.Format;
import com.ticketez_backend_springboot.modules.genre.Genre;
import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.showtime.Showtime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class MovieShowtimeDTO {
    List<MovieObjResp> listMovieObjResp;
    
    @Data
    public class MovieObjResp {
        Movie movie;
        List<Genre> genres;
        List<FormatAndShowtimes> listFormatAndShowtimes;

        @Data
        public class FormatAndShowtimes {
            Format format;
            List<Showtime> showtimes;
        }
    }
}
