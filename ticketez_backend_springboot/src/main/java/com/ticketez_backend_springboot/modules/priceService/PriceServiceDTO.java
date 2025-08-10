package com.ticketez_backend_springboot.modules.priceService;

import com.ticketez_backend_springboot.modules.service.Service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PriceServiceDTO {
    Service service;
    PriceService price;
}
