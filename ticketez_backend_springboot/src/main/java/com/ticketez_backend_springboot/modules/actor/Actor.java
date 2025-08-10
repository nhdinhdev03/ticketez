package com.ticketez_backend_springboot.modules.actor;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.actorMovie.ActorMovie;

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
@Table(name = "Actors")
@Data
public class Actor {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String fullname;
	@Temporal(TemporalType.DATE)
	private Date birthday;
	private Boolean gender;
	private String country;
	private String avatar;
	private String email;
	private String biography;

	@JsonIgnore
	@OneToMany(mappedBy = "actor")
	private List<ActorMovie> actorsMovies;

}