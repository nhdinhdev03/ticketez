package com.ticketez_backend_springboot.modules.article;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleDAO extends JpaRepository<Article, Long> {

        @Query("SELECT a FROM Article a ")
        Page<Article> getArticleMovie(Pageable pageable);

        @Query("SELECT a FROM Article a where a.status = true")
        Page<Article> getArticleMovieTrue(Pageable pageable);
}
