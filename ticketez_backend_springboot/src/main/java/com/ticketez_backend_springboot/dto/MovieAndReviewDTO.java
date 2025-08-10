package com.ticketez_backend_springboot.dto;

import java.util.List;

import com.ticketez_backend_springboot.modules.account.Account;
import com.ticketez_backend_springboot.modules.article.Article;
import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.review.Review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieAndReviewDTO {
    private long totalItems;
    private int totalPages;
    List<MovieAndListReviewObjResp> listMovieAndListReviewObjResp;

    @Data
    public class MovieAndListReviewObjResp {
        Movie movie;
        List<Review> review;
    }

}
