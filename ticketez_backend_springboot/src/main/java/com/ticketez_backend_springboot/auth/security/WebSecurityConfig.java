package com.ticketez_backend_springboot.auth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ticketez_backend_springboot.auth.security.jwt.AuthEntryPointJwt;
import com.ticketez_backend_springboot.auth.security.jwt.AuthTokenFilter;
import com.ticketez_backend_springboot.auth.security.services.UserDetailsServiceImpl;

@Configuration
@EnableMethodSecurity
// (securedEnabled = true,
// jsr250Enabled = true,
// prePostEnabled = true) // by default
public class WebSecurityConfig { // extends WebSecurityConfigurerAdapter {
  @Autowired
  UserDetailsServiceImpl userDetailsService;

  @Autowired
  private AuthEntryPointJwt unauthorizedHandler;

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());

    return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> {
          auth.requestMatchers(
              "/api/**", "/api/account/**", "/api/auth/**", "/api/booking/**", "/api/cinema/**",
              "/api/cinemaChain/**", "/api/cinemaComplex/**", "/api/cinemaType/**", "/api/actor/**",
              "/api/director/**", "/api/discount/**", "/api/discountsBookings/**", "/api/event/**", "/api/format/**",
              "/api/formatMovie/**", "/api/genre/**", "/api/genreMovie/**", "/api/movie/**", "/api/producer/**",
              "/api/studio/**", "/api/mpaaRating/**", "/api/paymentInfo/**", "/api/price/**",
              "/api/priceService/**", "/api/province/**", "/api/review/**", "/api/seat/**", "/api/seatBooking/**",
              "/api/seatchart/**", "/api/seat-choose/**", "/api/seatType/**", "/api/servicecombo/**",
              "/api/servicebookings/**", "/api/showtime/**", "/api/verification/**", "/api/article/**",
              "/api/articleMovie/**", "/api/price_seat_type/**", "/api/service-choose/**", "/api/upload/**",
              "/api/accountRole/**")
              .permitAll();
          auth.requestMatchers("/test/test/**").permitAll();
          auth.anyRequest().authenticated();
        });

    http.authenticationProvider(authenticationProvider());
    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
