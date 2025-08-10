package com.ticketez_backend_springboot.modules.studio;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.movieStudio.MovieStudio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Entity
@Table(name = "Studios")
@Data
public class Studio {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	private String image;
	@Column(name = "founded_date")
	@Temporal(TemporalType.DATE)
	private Date foundedDate;
	private String country;
	private String email;
	private String address;
	private String website;
	private String description;

	@JsonIgnore
	@OneToMany(mappedBy = "studio")
	private List<MovieStudio> movieStudios;

}