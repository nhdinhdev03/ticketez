package com.ticketez_backend_springboot.modules.producer;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.movieProducer.MovieProducer;

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
@Table(name = "Producers")
@Data
public class Producer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	private String image;
	@Temporal(TemporalType.DATE)
	private String birthday;
	private String nationality;
	private String email;
	private String biography;

	@JsonIgnore
	@OneToMany(mappedBy = "producer")
	private List<MovieProducer> movieProducers;
}
