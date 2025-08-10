package com.ticketez_backend_springboot.modules.accountRole;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ticketez_backend_springboot.auth.models.SecurityAccount;
import com.ticketez_backend_springboot.auth.models.SecurityERole;
import com.ticketez_backend_springboot.auth.models.SecurityRole;
import com.ticketez_backend_springboot.auth.payload.request.SignupRequest;
import com.ticketez_backend_springboot.auth.payload.response.MessageResponse;
import com.ticketez_backend_springboot.auth.repository.AccountRepository;
import com.ticketez_backend_springboot.auth.repository.RoleRepository;
import com.ticketez_backend_springboot.dto.AccountDTO;
import com.ticketez_backend_springboot.dto.AccountRolesDTO;
import com.ticketez_backend_springboot.dto.ResponseDTO;
import com.ticketez_backend_springboot.dto.TotalDashboardAdmin;
import com.ticketez_backend_springboot.modules.account.Account;
import com.ticketez_backend_springboot.modules.account.AccountDAO;
import com.ticketez_backend_springboot.modules.account.AccountStatus;
import com.ticketez_backend_springboot.modules.account.AccountUpdateRequest;
import com.ticketez_backend_springboot.modules.accountLockHistory.AccountLockHistory;
import com.ticketez_backend_springboot.modules.accountLockHistory.AccountLockHistoryDAO;
import com.ticketez_backend_springboot.modules.movieStudio.MovieStudio;
import com.ticketez_backend_springboot.modules.role.Role;
import com.ticketez_backend_springboot.modules.verification.Verification;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/accountRole")
public class AccountRoleAPI {
    @Autowired
    AccountDAO accountDAO;

    @Autowired
    AccountRoleDAO accountRoleDAO;

    @Autowired
    AccountLockHistoryDAO accountLockHistoryDAO;
    @Autowired
    AccountRepository accountRepository;

    @Autowired
    PasswordEncoder encoder;
    @Autowired
    RoleRepository roleRepository;

    @GetMapping("/getAll")
    public ResponseEntity<List<Account>> findAll() {
        List<Account> accounts = accountDAO.findAll();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit,
            @RequestParam("search") Optional<String> search,
            @RequestParam("status") Optional<Integer> status) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10));
            Page<Account> page = accountRoleDAO.findByAccountRole(pageable, status.orElse(AccountStatusRole.ACTIVE),
                    search.orElse(""));
            List<AccountRolesDTO> accountRolesDTOs = new ArrayList<>();

            for (Account account : page.getContent()) {
                AccountRolesDTO accountRolesDTO = new AccountRolesDTO();
                accountRolesDTO.setAccount(account);
                List<Role> roles = new ArrayList<>();
                for (AccountRole accountRole : account.getAccountRoles()) {
                    roles.add(accountRole.getRole());
                }
                ;
                accountRolesDTO.setRoles(roles);
                accountRolesDTOs.add(accountRolesDTO);

            }
            System.out.println(accountRolesDTOs.get(0).getAccount().getId());
            ResponseDTO<AccountRolesDTO> responseDTO = new ResponseDTO<>();
            responseDTO.setData(accountRolesDTOs);
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") String id) {
        try {
            if (!accountDAO.existsById(id)) {
                return new ResponseEntity<>("Không tìm thấy người dùng",
                        HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(accountDAO.findById(id).get());
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/signupNV")
    public ResponseEntity<?> registerUser(@Valid @RequestBody DTONV signUpRequest) {
        try {
            if (accountRepository.existsById(signUpRequest.getId())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Tên người dùng đã tồn tại!"));
            }

            if (accountRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Email đã được sử dụng!"));
            }

            if (accountRepository.existsByFullname(signUpRequest.getFullname())) {
                // Handle duplicate fullname if needed
            }

            if (accountRepository.existsByPhone(signUpRequest.getPhone())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Số điện thoại đã được sử dụng!"));
            }

            SecurityAccount account = new SecurityAccount(
                    signUpRequest.getId(),
                    signUpRequest.getPhone(),
                    signUpRequest.getFullname(),
                    signUpRequest.getEmail(),
                    encoder.encode(signUpRequest.getPassword()));

            account.setGender(signUpRequest.getGender());
            account.setAddress(signUpRequest.getAddress());
            account.setImage(signUpRequest.getImage());

            Set<String> strRoles = signUpRequest.getRole();
            Set<SecurityRole> roles = new HashSet<>();

            if (strRoles != null) {
                strRoles.forEach(role -> {
                    SecurityERole securityERole = SecurityERole.fromString(role);
                    System.out.println("Role from JSON: " + securityERole);
                    SecurityRole securityRole = roleRepository.findByName(securityERole)
                            .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò"));
                    System.out.println("SecurityRole found: " + securityRole.getName());
                    roles.add(securityRole);
                });
            }

            // ngày tạo
            account.setStatus(1);
            account.setCreatedDate(new Date());

            account.setRoles(roles);

            accountRepository.save(account);

            return ResponseEntity.ok(new MessageResponse("Người dùng đã đăng ký thành công!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Lỗi server: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(@PathVariable("id") String id,
            @RequestBody Account account) {
        try {
            if (!accountDAO.existsById(id)) {
                return new ResponseEntity<>("Người dùng không tồn tại",
                        HttpStatus.NOT_FOUND);
            }
            accountDAO.save(account);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/infoUser/{id}")
    public ResponseEntity<?> patchInfoUser(@PathVariable("id") String id,
            @RequestBody AccountDTO accountDTO) {
        try {
            if (!accountDAO.existsById(id)) {
                return new ResponseEntity<>("Người dùng không tồn tại", HttpStatus.NOT_FOUND);
            }
            Account account = accountDAO.findById(id).orElse(null);
            if (account != null) {
                account.setFullname(accountDTO.getFullname());
                account.setBirthday(accountDTO.getBirthday());
                account.setGender(accountDTO.isGender());
                account.setEmail(accountDTO.getEmail());
                account.setPhone(accountDTO.getPhone());
                account.setAddress(accountDTO.getAddress());
                account.setImage(accountDTO.getImage());
                accountDAO.save(account);
                return ResponseEntity.ok("Sửa thành công");
            } else {
                return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<?> patch(@PathVariable("id") String id,
            @RequestBody AccountUpdateRequest request) {
        try {
            if (!accountDAO.existsById(id)) {
                return new ResponseEntity<>("Người dùng không tồn tại",
                        HttpStatus.NOT_FOUND);
            }
            Account account = accountDAO.findById(id).orElse(null);
            AccountLockHistory accountLockHistory = new AccountLockHistory();
            if (account != null) {
                Integer status = request.getStatus();
                String reason = request.getReason();
                if (status != null) {
                    account.setStatus(status);
                    accountDAO.save(account);
                    //

                    if (status == 2) {
                        accountLockHistory.setAccount(account);
                        accountLockHistory.setReason(reason);
                        accountLockHistory.setEventDate(new Date());
                        accountLockHistory.setEventType(status);
                        accountLockHistoryDAO.save(accountLockHistory);
                    } else if (status == 1) {
                        List<AccountLockHistory> listAccountLockHistory = accountLockHistoryDAO
                                .findByAccountOrderByEventDateDesc(account);
                        AccountLockHistory accountLockHistoryActive = listAccountLockHistory.get(0);
                        accountLockHistoryActive.setEventType(status);
                        accountLockHistoryDAO.save(accountLockHistoryActive);
                    }

                }
                // return ResponseEntity.ok("Cập nhật trạng thái thành công");
                return ResponseEntity.ok(account);
            } else {
                return new ResponseEntity<>("Server error, vui lòng thử lại sau!",
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/total-user")
    public ResponseEntity<?> getTotalTicketsAndTotalMovies() {
        try {
            List<TotalDashboardAdmin> account = accountDAO.getTotalUser();
            return ResponseEntity.ok(account);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}