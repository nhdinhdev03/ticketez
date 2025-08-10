package com.ticketez_backend_springboot.modules.articleMovie;

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
public class ArticleMoviePK implements Serializable {

    @Column(name = "movie_id", insertable = false, updatable = false)
    private Long movieId;

    @Column(name = "article_id", insertable = false, updatable = false)
    private Long articleId;

}