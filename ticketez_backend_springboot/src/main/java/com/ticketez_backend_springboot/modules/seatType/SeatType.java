package com.ticketez_backend_springboot.modules.seatType;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.priceSeatType.PriceSeatType;
import com.ticketez_backend_springboot.modules.seat.Seat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Seat_Types")
@Data
public class SeatType {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	private String nickName;
	private String color;
	private Integer width;
	private String image;
	private String description;

	@JsonIgnore
	@OneToMany(mappedBy = "seatType")
	private List<Seat> seats;

	@JsonIgnore
	@OneToMany(mappedBy = "seatType")
	private List<PriceSeatType> priceSeatTypes;

}