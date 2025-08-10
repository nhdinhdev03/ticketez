package com.ticketez_backend_springboot.modules.priceSeatType;

import com.ticketez_backend_springboot.modules.price.Price;
import com.ticketez_backend_springboot.modules.seatType.SeatType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Price_Seat_Types")
@Data
public class PriceSeatType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double weekdayPrice;
    private Double weekendPrice;

    @ManyToOne
    @JoinColumn(name = "seat_type_id")
    private SeatType seatType;

    @ManyToOne
    @JoinColumn(name = "price_id")
    private Price price;

}
