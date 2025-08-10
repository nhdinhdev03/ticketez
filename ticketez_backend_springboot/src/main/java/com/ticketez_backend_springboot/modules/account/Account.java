package com.ticketez_backend_springboot.modules.account;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.modules.accountLockHistory.AccountLockHistory;
import com.ticketez_backend_springboot.modules.accountRole.AccountRole;
import com.ticketez_backend_springboot.modules.activityLog.ActivityLog;
import com.ticketez_backend_springboot.modules.booking.Booking;
import com.ticketez_backend_springboot.modules.event.Event;
import com.ticketez_backend_springboot.modules.review.Review;
import com.ticketez_backend_springboot.modules.seatChoose.SeatChoose;
import com.ticketez_backend_springboot.modules.serviceChoose.ServiceChoose;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Entity
@Table(name = "Accounts")
@Data
public class Account {
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
	private Boolean verified;
	private int points;

	@JsonIgnore
	@OneToMany(mappedBy = "account")
	private List<Review> reviews;
	@JsonIgnore
	@OneToMany(mappedBy = "account")
	private List<ServiceChoose> serviceChooses;
	@JsonIgnore
	@OneToMany(mappedBy = "account")
	private List<SeatChoose> seatChooses;

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

}
