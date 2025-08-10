package com.ticketez_backend_springboot.auth.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {
  @GetMapping("/all")
  public String allAccess() {
    return "Public Content.";
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @GetMapping("/super-admin")
  public ResponseEntity<?> forSuperAdmin() {
    return ResponseEntity.ok().body("Super Admin content");
  }

  @PreAuthorize("hasRole('MOVIE_MANAGEMENT_ADMIN')")
  @GetMapping("/movie-management")
  public ResponseEntity<?> forMovieManagementAdmin() {
    return ResponseEntity.ok().body("Movie Management Admin content");
  }
}
