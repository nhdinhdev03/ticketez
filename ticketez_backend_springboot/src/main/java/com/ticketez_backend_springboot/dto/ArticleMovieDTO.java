package com.ticketez_backend_springboot.dto;

import java.util.List;

import com.ticketez_backend_springboot.modules.article.Article;
import com.ticketez_backend_springboot.modules.genre.Genre;
import com.ticketez_backend_springboot.modules.movie.Movie;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleMovieDTO {
    private long totalItems;
    private int totalPages;
    List<MovieObjResp> listMovieObjResp;
    
    @Data
    public class MovieObjResp {
        Article article;
        List<MovieandGens> listMovieandGens;
        @Data
        public class MovieandGens {
            Movie movie;
            List<Genre> genres;
        }
    }
}
