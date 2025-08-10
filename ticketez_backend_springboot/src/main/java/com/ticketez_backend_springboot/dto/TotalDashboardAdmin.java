package com.ticketez_backend_springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TotalDashboardAdmin {
    private Long total_tickets;
    private Long total_movies;
     private Long total_user;
}
