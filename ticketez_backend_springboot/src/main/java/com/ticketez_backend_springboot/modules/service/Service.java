package com.ticketez_backend_springboot.modules.service;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplex;
import com.ticketez_backend_springboot.modules.priceService.PriceService;
import com.ticketez_backend_springboot.modules.serviceBooking.ServiceBooking;
import com.ticketez_backend_springboot.modules.serviceChoose.ServiceChoose;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Services")
@Data
public class Service {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	private String description;
	private String image;
	private Integer quantity;

	@ManyToOne
	@JoinColumn(name = "cinema_complex_id")
	private CinemaComplex cinemaComplex;

	@JsonIgnore
	@OneToMany(mappedBy = "service")
	private List<PriceService> priceServices;

	@JsonIgnore
	@OneToMany(mappedBy = "service")
	private List<ServiceBooking> servicesBookings;

	@JsonIgnore
	@OneToMany(mappedBy = "service")
	private List<ServiceChoose> serviceChooses;

}