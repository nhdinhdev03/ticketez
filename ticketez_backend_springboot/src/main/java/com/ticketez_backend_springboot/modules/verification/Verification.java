package com.ticketez_backend_springboot.modules.verification;

import java.time.LocalDateTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ticketez_backend_springboot.auth.models.SecurityAccount;
import com.ticketez_backend_springboot.modules.account.Account;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Verification")
@Data
public class Verification {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "account_id")
	private String accountId;

	private String code;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "expires_at")
	private LocalDateTime expiresAt;

	private boolean active;

	@ManyToOne
	@JoinColumn(name = "account_id", referencedColumnName = "phone", insertable = false, updatable = false)
	private Account account;

	@JsonIgnore
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "account_id", referencedColumnName = "id", insertable = false, updatable = false)
	private SecurityAccount securityAccount;
}
