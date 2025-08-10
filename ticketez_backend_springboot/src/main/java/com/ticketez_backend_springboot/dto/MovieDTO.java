package com.ticketez_backend_springboot.dto;

import java.util.List;

import com.ticketez_backend_springboot.modules.actor.Actor;
import com.ticketez_backend_springboot.modules.director.Director;
import com.ticketez_backend_springboot.modules.format.Format;
import com.ticketez_backend_springboot.modules.genre.Genre;
import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.producer.Producer;
import com.ticketez_backend_springboot.modules.studio.Studio;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO {
    Movie movie;
    List<Director> directors;
    List<Actor> actors;
    List<Genre> genres;
    List<Format> formats;
    List<Producer> producers;
    List<Studio> studios;
}
