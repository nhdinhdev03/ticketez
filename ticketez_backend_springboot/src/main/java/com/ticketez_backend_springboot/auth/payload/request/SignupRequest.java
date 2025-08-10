package com.ticketez_backend_springboot.auth.payload.request;

import java.util.Set;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {
  @NotBlank
  @Size(min = 3, max = 20)
  private String id;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;
  private String fullname;

  private Set<String> role;

  @NotBlank
  @Size(min = 8, max = 40)
  private String password;

  private Boolean gender;
  private String phone;

}
