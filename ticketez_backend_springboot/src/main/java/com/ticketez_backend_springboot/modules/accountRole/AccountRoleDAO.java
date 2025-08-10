package com.ticketez_backend_springboot.modules.accountRole;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ticketez_backend_springboot.dto.AccountDTO;
import com.ticketez_backend_springboot.modules.account.Account;

public interface AccountRoleDAO extends JpaRepository<AccountRole, String> {

        // @Query("SELECT ar FROM AccountRole ar JOIN ar.role r WHERE r.id NOT IN (1,
        // 2)")
        // List<AccountRole> findByAccountRole();
        @Query("SELECT a, r.name as name FROM Account a JOIN a.accountRoles ar JOIN ar.role r "
                        + "WHERE ar.role.id NOT IN (1, 2) AND a.fullname LIKE CONCAT('%', :search, '%') AND a.status = :status ORDER BY a.createdDate DESC")
        Page<Account> findByAccountRole(Pageable pageable, @Param("status") Integer status,
                        @Param("search") String search);
}
