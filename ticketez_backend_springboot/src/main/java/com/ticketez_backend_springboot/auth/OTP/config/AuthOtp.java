package com.ticketez_backend_springboot.auth.OTP.config;

import lombok.Data;

@Data
public class AuthOtp {
    String email;
    String otp;
}
