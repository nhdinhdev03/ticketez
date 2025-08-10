package com.ticketez_backend_springboot.modules.articleMovie;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleMovieDAO extends JpaRepository<ArticleMovie, ArticleMoviePK> {
                @Query("select am from ArticleMovie am where am.article.id = :articleId")
      List<ArticleMovie> getMovieByArticle(@Param("articleId") Long articleId);
}
