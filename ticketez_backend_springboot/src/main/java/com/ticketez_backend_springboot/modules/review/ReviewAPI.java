package com.ticketez_backend_springboot.modules.review;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ticketez_backend_springboot.dto.MovieAndReviewDTO;
import com.ticketez_backend_springboot.dto.ResponseDTO;
import com.ticketez_backend_springboot.modules.account.Account;
import com.ticketez_backend_springboot.modules.account.AccountDAO;
import com.ticketez_backend_springboot.modules.booking.Booking;
import com.ticketez_backend_springboot.modules.booking.BookingDAO;
import com.ticketez_backend_springboot.modules.cinema.Cinema;
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplex;
import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.movie.MovieDAO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/review")
public class ReviewAPI {

    @Autowired
    ReviewDAO reviewDAO;

    @Autowired
    MovieDAO movieDAO;
    // @GetMapping
    // public ResponseEntity<List<Review>> findAll() {
    // return ResponseEntity.ok(reviewDAO.findAll());
    // }
    @Autowired
    AccountDAO accountDAO;
    @Autowired
    BookingDAO bookingDAO;

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") Long id) {
        try {
            if (!reviewDAO.existsById(id)) {
                return new ResponseEntity<>("Không tìm thấy review", HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(reviewDAO.findById(id).get());
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10));
            Page<Review> page = reviewDAO.findAll(pageable);
            ResponseDTO<Review> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<Review>> findAll() {
        List<Review> review = reviewDAO.findAllByOrderByIdDesc();
        return ResponseEntity.ok(review);
    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody Review review) {
        try {
            reviewDAO.save(review);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(@PathVariable("id") Long id, @RequestBody Review review) {
        try {
            if (!reviewDAO.existsById(id)) {
                return new ResponseEntity<>("không tồn tại", HttpStatus.NOT_FOUND);
            }
            reviewDAO.save(review);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<?> put(@PathVariable("id") Long id) {
        try {
            if (!reviewDAO.existsById(id)) {
                return new ResponseEntity<>("không tồn tại", HttpStatus.NOT_FOUND);
            }
            Review review = reviewDAO.findById(id).get();
            Review newReview = review;
            newReview.setStatus(ReviewStatus.APPROVED);
            reviewDAO.save(newReview);
            return ResponseEntity.ok(newReview);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/like")
    public ResponseEntity<?> addLikeToReview(@PathVariable("id") Long id) {
        try {
            if (!reviewDAO.existsById(id)) {
                return new ResponseEntity<>("Không tìm thấy review", HttpStatus.NOT_FOUND);
            }

            Review review = reviewDAO.findById(id).get();
            review.setLikeComent(review.getLikeComent() + 1);
            reviewDAO.save(review);

            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Thêm dislike
    @PatchMapping("/{id}/dislike")
    public ResponseEntity<?> addDislikeToReview(@PathVariable("id") Long id) {
        try {
            if (!reviewDAO.existsById(id)) {
                return new ResponseEntity<>("Không tìm thấy review", HttpStatus.NOT_FOUND);
            }

            Review review = reviewDAO.findById(id).get();
            // Giảm số lượng dislike đi 1 (hoặc thực hiện hành động dislike cụ thể của bạn)
            review.setLikeComent(Math.max(0, review.getLikeComent() - 1));
            reviewDAO.save(review);

            return ResponseEntity.ok(review);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Không tìm thấy review", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            reviewDAO.deleteById(id);
            return ResponseEntity.ok().body("Xoá bình luận thành công");
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xóa", HttpStatus.CONFLICT);
        }

    }

    @GetMapping("/get/by-movie/{movieId}")
    public ResponseEntity<?> getReviewsByMovieId(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit,
            @PathVariable("movieId") Long movieId) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }

            Optional<Movie> optionalMovie = movieDAO.findById(movieId);
            // Account account = accountDAO.findById("user6").get();
            // System.out.println("+++++++++++++" + !account.getBookings().isEmpty());

            if (optionalMovie.isPresent()) {
                Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10));
                Page<Review> page = reviewDAO.findAllByMovieId(movieId, pageable);
                ResponseDTO<Review> responseDTO = new ResponseDTO<>();
                responseDTO.setData(page.getContent());
                responseDTO.setTotalItems(page.getTotalElements());
                responseDTO.setTotalPages(page.getTotalPages());
                return ResponseEntity.ok(responseDTO);

            }

            return new ResponseEntity<>("Không tìm thấy phim có id " + movieId, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi để theo dõi tình trạng lỗi
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/check-account-booking")
    public ResponseEntity<?> getCheckAccountBooking(@RequestParam("accountId") String accountId,
            @RequestParam("movieId") Long movieId) {
        try {
            Account optionalAccount = accountDAO.findById(accountId).orElse(null);
            Movie optionalMovie = movieDAO.findById(movieId).orElse(null);

            if (optionalAccount == null || optionalMovie == null) {
                return new ResponseEntity<>("Không tìm thấy tài khoản hoặc bộ phim",
                        HttpStatus.NOT_FOUND);
            }

            // Kiểm tra xem tài khoản đã thanh toán và có vé đã sử dụng hay không
            List<Review> reviews = reviewDAO.findByCheckAccBooking(optionalMovie, optionalAccount);
            List<Booking> bookings = bookingDAO.findPaidAndUsedBookingsByMovieAndAccount(optionalMovie,
                    optionalAccount);

            boolean isPaid = !bookings.isEmpty()
                    && bookings.stream().anyMatch(booking -> booking.getTicketStatus() == 1);

            return ResponseEntity.ok(isPaid);
        } catch (Exception e) {
            // Log the exception details
            // log.error("Error while checking account booking", e);
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // @GetMapping("/get/check-account-booking")
    // public ResponseEntity<?> getcheckAccountBooking(@RequestParam("accountId")
    // String accountId,
    // @RequestParam("movieId") Long movieId) {
    // try {
    // Account optionalAccount = accountDAO.findById(accountId).get();
    // Movie optionalMovie = movieDAO.findById(movieId).get();

    // List<Review> reviews = reviewDAO.findByCheckAccBooking(optionalMovie,
    // optionalAccount);

    // Boolean check = false;
    // if (!reviews.isEmpty()) {
    // check = true;
    // return ResponseEntity.ok(check);
    // }

    // return ResponseEntity.ok(check);
    // } catch (Exception e) {
    // e.printStackTrace();
    // return new ResponseEntity<>("Server error, vui lòng thử lại sau!",
    // HttpStatus.INTERNAL_SERVER_ERROR);
    // }
    // }

    // gọi movie đề lấy reivew của movie đó

    @GetMapping("/get/by-movie-review")
    public ResponseEntity<?> getMovieOrReview(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10));
            Page<Movie> page = reviewDAO.findByMovieOrReview(pageable);
            MovieAndReviewDTO movieAndReviewDTO = new MovieAndReviewDTO();
            List<MovieAndReviewDTO.MovieAndListReviewObjResp> listMovieAndListReviewObjResps = new ArrayList<>();
            for (Movie movie : page.getContent()) {
                MovieAndReviewDTO.MovieAndListReviewObjResp movieAndListReviewObjResp = movieAndReviewDTO.new MovieAndListReviewObjResp();
                List<Review> reviews = reviewDAO.findByMovieOrderByIdDesc(movie);
                movieAndListReviewObjResp.setReview(reviews);
                movieAndListReviewObjResp.setMovie(movie);
                listMovieAndListReviewObjResps.add(movieAndListReviewObjResp);

            }
            movieAndReviewDTO.setListMovieAndListReviewObjResp(listMovieAndListReviewObjResps);
            movieAndReviewDTO.setTotalItems(page.getTotalElements());
            movieAndReviewDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(movieAndReviewDTO);
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi để theo dõi tình trạng lỗi
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/all-movie-by-review")
    public ResponseEntity<?> getOnMovieAndReview(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }

            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10));
            Page<Movie> page = reviewDAO.findAllMovieAndReview(pageable);
            ResponseDTO<Movie> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
            e.printStackTrace(); // In lỗi để theo dõi tình trạng lỗi
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/review-by-movieId")
    public ResponseEntity<?> getMovieAndReviewId(
            @RequestParam("movieId") long movieId,
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("status") Optional<Integer> status,
            @RequestParam("limit") Optional<Integer> limit) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Movie movie = movieDAO.findById(movieId).get();
            if (movie != null) {
                Sort sort = Sort.by(Sort.Order.desc("id"));
                Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
                Page<Review> page = reviewDAO.findByMovieAndStatus(pageable, movie, status.orElse(null));
                ResponseDTO<Review> responseDTO = new ResponseDTO<>();
                responseDTO.setData(page.getContent());
                responseDTO.setTotalItems(page.getTotalElements());
                responseDTO.setTotalPages(page.getTotalPages());
                return ResponseEntity.ok(responseDTO);
            }
            return new ResponseEntity<>("Lỗi ", HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
