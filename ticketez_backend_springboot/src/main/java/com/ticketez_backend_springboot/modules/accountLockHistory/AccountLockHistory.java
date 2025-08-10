package com.ticketez_backend_springboot.modules.accountLockHistory;

import java.util.Date;
import java.util.List;

import com.ticketez_backend_springboot.modules.account.Account;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Entity
@Table(name = "Account_Lock_History")
@Data
public class AccountLockHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Integer eventType;
	@Temporal(TemporalType.TIMESTAMP)
	private Date eventDate;
	private String reason;

	@ManyToOne
	@JoinColumn(name = "account_id")
	private Account account;

	public List<AccountLockHistory> findByAccountNe(String id2) {
		return null;
	}


}
