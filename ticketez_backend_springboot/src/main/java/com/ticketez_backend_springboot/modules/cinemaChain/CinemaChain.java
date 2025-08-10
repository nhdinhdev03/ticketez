package com.ticketez_backend_springboot.modules.cinemaChain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplex;

import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
@Table(name = "Cinema_Chains")
@Data
public class CinemaChain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String image;
    private String banner;
    private String description;

    @JsonIgnore
    @OneToMany(mappedBy = "cinemaChain")
    private List<CinemaComplex> cinemaComplexs;
}
