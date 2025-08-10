package com.ticketez_backend_springboot.modules.accountLockHistory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ticketez_backend_springboot.modules.account.Account;

public interface AccountLockHistoryDAO extends JpaRepository<AccountLockHistory, Long> {
    // @Query("SELECT alh FROM AccountLockHistory alh WHERE alh.account.id = :accountId ORDER BY alh.eventDate DESC")
    // List<AccountLockHistory> fing(@Param("accountId") String accountId);

   List<AccountLockHistory> findByAccountOrderByEventDateDesc(Account account);


        List<AccountLockHistory> findByAccountOrderByIdDesc(Account account);
} 