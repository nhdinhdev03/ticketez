package com.ticketez_backend_springboot.modules.accountRole;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor

public class AccountRolePK implements Serializable {

  @Column(name = "account_id", insertable = false, updatable = false)
  private String accountID;

  @Column(name = "role_id", insertable = false, updatable = false)
  private Long roleID;

  // public AccountRolePK(String accountID, Long roleID) {
  //   this.accountID = accountID;
  //   this.roleID = roleID;
  // }
}
