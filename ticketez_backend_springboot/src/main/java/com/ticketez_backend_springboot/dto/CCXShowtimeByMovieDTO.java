package com.ticketez_backend_springboot.dto;

import java.util.List;

import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplex;
import com.ticketez_backend_springboot.modules.format.Format;
import com.ticketez_backend_springboot.modules.showtime.Showtime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CCXShowtimeByMovieDTO {

    List<CinemaComplexObjResp> cinemaComplexObjResps;
    
    @Data
    public class CinemaComplexObjResp {
        CinemaComplex  cinemaComplex;
        List<FormatAndShowtimes> listFormatAndShowtimes;

        @Data
        public class FormatAndShowtimes {
            Format format;
            List<Showtime> showtimes;
        }
    }
    
}
