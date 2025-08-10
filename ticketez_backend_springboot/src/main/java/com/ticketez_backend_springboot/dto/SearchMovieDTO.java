package com.ticketez_backend_springboot.dto;

import java.util.List;

import com.ticketez_backend_springboot.modules.genre.Genre;
import com.ticketez_backend_springboot.modules.movie.Movie;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchMovieDTO {
    private Integer totalPages;
    private Long totalItems;

    List<MovieObjResp> listMovieObjResp;

    @Data
    public class MovieObjResp {
        Movie movie;
        List<Genre> genres;
    }

}
