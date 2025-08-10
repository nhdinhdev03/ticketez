package com.ticketez_backend_springboot.dto;

import java.sql.Time;
import java.util.List;

import com.ticketez_backend_springboot.modules.cinemaChain.CinemaChain;
import com.ticketez_backend_springboot.modules.province.Province;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CinemaToCinemaComplexDTO {

    private Long id;
    private String name;
    private String address;
    private String phone;
    private Time openingTime;
    private Time closingTime;
    private CinemaChain cinemaChain;
    private Province province;
    private Long totalCinemas;
}
