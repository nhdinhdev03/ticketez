package com.ticketez_backend_springboot.dto;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CinemaComplexToProvinceDTO {
    private Number id ;
    private String name ;
    private Number TotalCinemaComplex;
}
