package com.ticketez_backend_springboot.modules.price;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceFindDTO {
    List<Long> seatTypeIds;
    Long cinemaClxId;
    Long movieId;
}
