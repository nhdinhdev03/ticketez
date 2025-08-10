package com.ticketez_backend_springboot.modules.activityLog;

import java.util.Date;

import com.ticketez_backend_springboot.modules.account.Account;

import ch.qos.logback.core.joran.action.Action;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Activity_Logs")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ActivityLog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Date timeStamp;
	private String action;
	private String description;

	@Column(name = "ip_address")
	private String ipAddress;

	@Column(name = "user_agent")
	private String userAgent;
	private String result;

	// Lưu dạng json
	private String oldData;
	private String newData;

	@ManyToOne
	@JoinColumn(name = "account_id")
	private Account account;

}
