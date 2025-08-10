package com.ticketez_backend_springboot.modules.articleMovie;

import com.ticketez_backend_springboot.modules.article.Article;
import com.ticketez_backend_springboot.modules.movie.Movie;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Articles_Movies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleMovie {
    @EmbeddedId
    ArticleMoviePK directorMoviePK;

    @ManyToOne
    @JoinColumn(name = "article_id", insertable = false, updatable = false)
    private Article article;

    @ManyToOne
    @JoinColumn(name = "movie_id", insertable = false, updatable = false)
    private Movie movie;
}
