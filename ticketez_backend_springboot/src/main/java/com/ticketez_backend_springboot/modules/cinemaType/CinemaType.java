package com.ticketez_backend_springboot.modules.cinemaType;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.cinema.Cinema;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Cinema_Types")
@Data
public class CinemaType {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String typeName;
	private String description;

	@JsonIgnore
	@OneToMany(mappedBy = "cinemaType")
	private List<Cinema> cinemas;

}