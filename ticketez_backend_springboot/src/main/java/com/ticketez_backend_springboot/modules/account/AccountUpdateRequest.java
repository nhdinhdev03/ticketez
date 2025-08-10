package com.ticketez_backend_springboot.modules.account;

import lombok.Data;

@Data
public class AccountUpdateRequest {
    private Integer status;
    private String reason;
}
