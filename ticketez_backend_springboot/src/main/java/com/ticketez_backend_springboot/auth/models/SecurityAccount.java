package com.ticketez_backend_springboot.auth.models;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.accountLockHistory.AccountLockHistory;
import com.ticketez_backend_springboot.modules.accountRole.AccountRole;
import com.ticketez_backend_springboot.modules.activityLog.ActivityLog;
import com.ticketez_backend_springboot.modules.booking.Booking;
import com.ticketez_backend_springboot.modules.event.Event;
import com.ticketez_backend_springboot.modules.review.Review;
import com.ticketez_backend_springboot.modules.verification.Verification;

import jakarta.persistence.*;
import lombok.Data;

@Table(name = "Accounts")
// @Entity
// @Table(name = "Accounts", uniqueConstraints = {
// @UniqueConstraint(columnNames = "id"),
// @UniqueConstraint(columnNames = "email")
// })
@Entity
@Data
public class SecurityAccount {
    @Id
    private String id;
    private String phone;
    private String fullname;
    private String address;
    private String email;
    private String password;
    private Date birthday;
    private Boolean gender;
    private String image;
    private Integer status;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_date")
    private Date createdDate;
    private boolean verified;
    private int points;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "Accounts_Roles", joinColumns = @JoinColumn(name = "account_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<SecurityRole> roles = new HashSet<>();

    @JsonIgnore
    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
    private Verification verification;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<Review> reviews;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<Booking> bookings;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<AccountRole> accountRoles;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<ActivityLog> activityLogs;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<Event> events;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<AccountLockHistory> accountLockHistory;

    public SecurityAccount() {

    }

    public SecurityAccount(String id, String phone, String fullname, String email, String password) {
        this.id = id;
        this.phone = phone;
        this.fullname = fullname;
        this.email = email;
        this.password = password;

    }


}
