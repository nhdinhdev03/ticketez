package com.ticketez_backend_springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueStatisticsDTO {
    private Integer year ;
    private Integer month ;
    private Double amount;
}
