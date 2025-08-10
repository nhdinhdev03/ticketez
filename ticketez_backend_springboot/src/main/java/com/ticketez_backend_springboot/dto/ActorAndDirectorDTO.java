package com.ticketez_backend_springboot.dto;

import java.util.List;

import com.ticketez_backend_springboot.modules.actor.Actor;
import com.ticketez_backend_springboot.modules.director.Director;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActorAndDirectorDTO {
    ActorAndDirectorsObj actorAndDirectorsObj;

    @Data
    public class ActorAndDirectorsObj {
        List<Actor> actors;
        List<Director> directors;
    }
}
