package com.ticketez_backend_springboot.modules.account;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ticketez_backend_springboot.auth.OTP.util.EmailUtil;
import com.ticketez_backend_springboot.dto.AccountDTO;
import com.ticketez_backend_springboot.dto.ResponseDTO;
import com.ticketez_backend_springboot.dto.TotalDashboardAdmin;
import com.ticketez_backend_springboot.modules.accountLockHistory.AccountLockHistory;
import com.ticketez_backend_springboot.modules.accountLockHistory.AccountLockHistoryDAO;
import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.movie.MovieDAO;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/account")
public class AccountAPI {

    @Autowired
    AccountDAO accountDAO;
    
    @Autowired
    MovieDAO movieDAO;

    @Autowired 
    EmailUtil emailUtil;

    @Autowired
    AccountLockHistoryDAO accountLockHistoryDAO;

    // @GetMapping("/getAll")
    // public ResponseEntity<List<Account>> findAll() {
    // List<Account> accounts = accountDAO.findAllByOrderByPhoneDesc();
    // return ResponseEntity.ok(accounts);
    // }

    // @GetMapping
    // public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer>
    // pageNo,
    // @RequestParam("limit") Optional<Integer> limit,
    // @RequestParam("search") Optional<String> search,
    // @RequestParam("active") Optional<Boolean> active) {
    // try {

    // if (pageNo.isPresent() && pageNo.get() == 0) {
    // return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
    // }
    // Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10));
    // Page<AccountDTO> page =
    // accountDAO.getAllRoleUserAndActive(pageable,active.orElse(true),search.orElse(""));
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
            Page<AccountDTO> page = accountDAO.getAllRoleUserAndActive(pageable, status.orElse(AccountStatus.ACTIVE),
                    search.orElse(""));

            ResponseDTO<AccountDTO> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
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
                    }else if(status == 1) {
                        List<AccountLockHistory> listAccountLockHistory = accountLockHistoryDAO.findByAccountOrderByEventDateDesc(account);
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

    // @DeleteMapping("/{id}")
    // public ResponseEntity<?> delete(@PathVariable("id") String id) {
    // try {
    // accountDAO.deleteById(id);
    // return ResponseEntity.ok().build();
    // } catch (DataIntegrityViolationException e) {
    // return new ResponseEntity<>("Không thể xóa diễn viên do tài liệu tham khảo
    // hiện có", HttpStatus.CONFLICT);
    // }
    // }

    @GetMapping("/get/total-user")
    public ResponseEntity<?> getTotalTicketsAndTotalMovies() {
        try {
            List<TotalDashboardAdmin> account = accountDAO.getTotalUser();
            return ResponseEntity.ok(account);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    //  

    @GetMapping("/email/accounts/{movieId}")
    public ResponseEntity<?> listAccount(@PathVariable("movieId") Long movieId) {
        try {
            Movie movie = movieDAO.findById(movieId).orElse(null);

            if (movie == null) {
                return new ResponseEntity<>("Không tìm thấy phim với ID: " + movieId, HttpStatus.NOT_FOUND);
            }

            List<Account> accounts = accountDAO.listAccount(movie.getId());

            if (accounts.isEmpty()) {
                return new ResponseEntity<>("Không tìm thấy người dùng để gữi Email ", HttpStatus.NOT_FOUND);
            }

            for (Account account : accounts) {
                emailUtil.sendEmailAccount(movie, account);
            }

            return ResponseEntity.ok(accounts);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
