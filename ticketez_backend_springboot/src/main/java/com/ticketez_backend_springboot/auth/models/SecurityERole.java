package com.ticketez_backend_springboot.auth.models;

public enum SecurityERole {
    SUPER_ADMIN,
    USER,
    MOVIE_MANAGEMENT_ADMIN,
    SCHEDULING_PRICING_ADMIN,
    USER_MANAGEMENT_ADMIN;

    public static SecurityERole fromString(String role) {
        for (SecurityERole securityRole : SecurityERole.values()) {
            if (securityRole.name().equalsIgnoreCase(role)) {
                return securityRole;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy vai trò với tên: " + role);
    }
}
