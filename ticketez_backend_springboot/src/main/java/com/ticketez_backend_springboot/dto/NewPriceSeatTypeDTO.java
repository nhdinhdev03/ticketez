package com.ticketez_backend_springboot.dto;

import java.util.List;

import com.ticketez_backend_springboot.modules.price.Price;
import com.ticketez_backend_springboot.modules.priceSeatType.PriceSeatType;
import com.ticketez_backend_springboot.modules.seatType.SeatType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewPriceSeatTypeDTO {

    
    private Long id;
    private Double weekdayPrice;
    private Double weekendPrice;
    private SeatType seatType;
}
