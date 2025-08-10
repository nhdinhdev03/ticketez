package com.ticketez_backend_springboot.modules.review;

import java.util.Date;

import com.ticketez_backend_springboot.modules.account.Account;
import com.ticketez_backend_springboot.modules.movie.Movie;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Reviews")
@Data
public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String comment;
	private float rating;
	private Date createDate;
	private Date editDate;
	private Integer status;
	private Integer likeComent;

	@ManyToOne
	@JoinColumn(name = "account_id")
	private Account account;

	@ManyToOne
	@JoinColumn(name = "movie_id")
	private Movie movie;

}