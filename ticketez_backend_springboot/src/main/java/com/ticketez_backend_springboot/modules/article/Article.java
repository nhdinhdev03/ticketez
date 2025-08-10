package com.ticketez_backend_springboot.modules.article;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.articleMovie.ArticleMovie;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Articles")
@Data
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String banner;
    private String content;
    private Boolean status;

    @Column(name = "create_date")
    private Date create_date;

    @JsonIgnore
	@OneToMany(mappedBy = "article")
	private List<ArticleMovie> articleMovies;
}
