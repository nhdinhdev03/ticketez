package com.ticketez_backend_springboot.modules.accountLockHistory;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketez_backend_springboot.modules.account.Account;
import com.ticketez_backend_springboot.modules.account.AccountDAO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/account-lock-history")
public class AccountLockHistoryAPI {

    @Autowired
    AccountLockHistoryDAO accountLockHistoryDAO;

    @Autowired
    AccountDAO accountDAO;


    @GetMapping("/{id}")
    public ResponseEntity<AccountLockHistory> findAll(@PathVariable("id") String id) {
        Account account = accountDAO.findById(id).get();
        List<AccountLockHistory> history = accountLockHistoryDAO.findByAccountOrderByIdDesc(account);
        return ResponseEntity.ok(history.get(0));
    }
    
}
