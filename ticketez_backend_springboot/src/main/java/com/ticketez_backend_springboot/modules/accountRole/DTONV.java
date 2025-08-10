package com.ticketez_backend_springboot.modules.accountRole;

import java.util.Date;
import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DTONV {

    private String id;
    private String fullname;
    private String password;
    private String birthday;
    private Boolean gender;
    private String email;
    private String phone;
    private String address;
    private String image;
    private Set<String> role;
}
