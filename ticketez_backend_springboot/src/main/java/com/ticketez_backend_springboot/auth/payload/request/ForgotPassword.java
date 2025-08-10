package com.ticketez_backend_springboot.auth.payload.request;


import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ForgotPassword {
    String code;
    String newPassword;
}
