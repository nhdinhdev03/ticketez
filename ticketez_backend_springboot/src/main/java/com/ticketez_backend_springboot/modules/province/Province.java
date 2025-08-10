package com.ticketez_backend_springboot.modules.province;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplex;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Provinces")
@Data
public class Province {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	@JsonIgnore
	@OneToMany(mappedBy = "province")
	private List<CinemaComplex> cinemaComplexes;

	// Các mối quan hệ khác...
}