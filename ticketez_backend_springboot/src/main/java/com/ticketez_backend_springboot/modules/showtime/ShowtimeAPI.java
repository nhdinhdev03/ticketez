package com.ticketez_backend_springboot.modules.showtime;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ticketez_backend_springboot.dto.ResponseDTO;
import com.ticketez_backend_springboot.modules.booking.Booking;
import com.ticketez_backend_springboot.modules.cinema.Cinema;
import com.ticketez_backend_springboot.modules.cinema.CinemaDAO;
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplex;
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplexDao;
import com.ticketez_backend_springboot.modules.format.Format;
import com.ticketez_backend_springboot.modules.format.FormatDAO;
import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.movie.MovieDAO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/showtime")
public class ShowtimeAPI {

    @Autowired
    ShowtimeDAO showtimeDAO;

    @Autowired
    MovieDAO movieDAO;

    @Autowired
    FormatDAO formatDAO;

    @Autowired
    CinemaComplexDao cinemaComplexDAO;

    @Autowired
    CinemaDAO cinemaDAO;

    @GetMapping
    public ResponseEntity<ResponseDTO<Showtime>> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return ResponseEntity.notFound().build();
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Showtime> page = showtimeDAO.findAll(pageable);
            ResponseDTO<Showtime> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<Showtime>> getfindAll() {
        List<Showtime> showtime = showtimeDAO.findAllByOrderByIdDesc();
        return ResponseEntity.ok(showtime);
    }

    // Lấy show time theo seatchart

    @GetMapping("get-showtime-by-seatchart/{id}")
    public ResponseEntity<List<Showtime>> findShowtimeBySeatChart(@PathVariable("id") Long id) {
        return ResponseEntity.ok(showtimeDAO.findShowtimesBySeatChartId(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Showtime> findById(@PathVariable("id") Long id) {
        if (!showtimeDAO.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(showtimeDAO.findById(id).get());
    }

    @PostMapping
    public ResponseEntity<Showtime> post(@RequestBody Showtime showtime) {
        showtimeDAO.save(showtime);
        return ResponseEntity.ok(showtime);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(@PathVariable("id") Long id, @RequestBody Showtime showtime) {
        Optional<Showtime> existingShowtimeOptional = showtimeDAO.findById(id);

        if (existingShowtimeOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Showtime existingShowtime = existingShowtimeOptional.get();

        // Kiểm tra xem Showtime có tồn tại trong booking hay không
        if (!existingShowtime.getBookings().isEmpty()) {
            // Nếu tồn tại trong booking, không cho phép cập nhật
            return ResponseEntity.badRequest().body("Không thể cập nhật xuất chiếu vì đã được đặt");
        }

        // Cập nhật các thông tin khác của Showtime
        existingShowtime.setStartTime(showtime.getStartTime());
        existingShowtime.setEndTime(showtime.getEndTime());
        existingShowtime.setFormatMovie(showtime.getFormatMovie());
        existingShowtime.setCinema(showtime.getCinema());
        existingShowtime.setSeatChart(showtime.getSeatChart());
        existingShowtime.setPrice(showtime.getPrice());

        // Lưu lại Showtime đã cập nhật
        showtimeDAO.save(existingShowtime);

        return ResponseEntity.ok(existingShowtime);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            // Kiểm tra xem có Booking nào liên quan đến Showtime không
            Showtime showtime = showtimeDAO.findById(id).orElse(null);
            if (showtime == null) {
                return new ResponseEntity<>("Không tìm thấy xuất chiếu để xoá", HttpStatus.NOT_FOUND);
            }

            List<Booking> bookings = showtime.getBookings();
            if (!bookings.isEmpty()) {
                return new ResponseEntity<>("Không thể xoá vì xuất chiếu đã được đặt", HttpStatus.CONFLICT);
            }

            // Nếu không có Booking liên quan, tiến hành xóa Showtime
            showtimeDAO.deleteById(id);
            return ResponseEntity.ok().body("Xoá xuất chiếu thành công");
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xoá vì dính khoá ngoại", HttpStatus.CONFLICT);
        }
    }

    //

    // @GetMapping("/get/showtime-by-ccx-movie-format-date/{cinemaComplexId}/{movieId}/{formatId}/{date}")
    @GetMapping("/get/showtime-by-ccx-movie-format-date")
    public ResponseEntity<?> getDuLie(
            @RequestParam("cinemaComplexId") Long CinemaComplexId,
            @RequestParam("movieId") Long movieId,
            @RequestParam("formatId") Long formatId,
            @RequestParam("date") Optional<LocalDate> date) {
        try {
            if (CinemaComplexId.equals("") && movieId.equals("") && formatId.equals("")) {
                return new ResponseEntity<>("Lỗi", HttpStatus.NOT_FOUND);
            }
            CinemaComplex cinemaComplex = cinemaComplexDAO.findById(CinemaComplexId).get();
            Movie movie = movieDAO.findById(movieId).get();
            Format format = formatDAO.findById(formatId).get();
            if (cinemaComplex != null && movie != null && format != null) {
                List<Showtime> showTimes = showtimeDAO.getShowtimesByCCXAndMovieAndFormatAndDate(cinemaComplex,
                        movie, format, date.orElse(LocalDate.now()));
                return ResponseEntity.ok(showTimes);
            }
            return null;
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // lấy dữ liệu bảng showtime theo endtime
    @GetMapping("/get/showtime-by-endTime-movie-format-date/{cinema}/{movieId}/{formatId}/{date}")
    public ResponseEntity<?> getShowtimesByCCXAndMovieAndFormatAndEndtime(
            @PathVariable("cinema") Long Cinema,
            @PathVariable("movieId") Long movieId,
            @PathVariable("formatId") Long formatId,
            @PathVariable("date") LocalDate date) {
        try {
            if (Cinema.equals("") && movieId.equals("") && formatId.equals("")) {
                return new ResponseEntity<>("Lỗi", HttpStatus.NOT_FOUND);
            }
            if (date == null || date.equals("")) {
                date = LocalDate.now();
            }
            Cinema cinema = cinemaDAO.findById(Cinema).get();
            Movie movie = movieDAO.findById(movieId).get();
            Format format = formatDAO.findById(formatId).get();
            if (cinema != null && movie != null && format != null) {
                List<Showtime> showtimes = showtimeDAO.getShowtimesByCCXAndMovieAndFormatAndEndtime(
                        cinema, movie, format, date);
                return ResponseEntity.ok(showtimes);
            }
            return null;
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/by-id-price/{priceId}")
    public List<Showtime> findShowtimesByPriceId(@PathVariable("priceId") Long priceId) {
        return showtimeDAO.findShowtimesByPriceId(priceId);
    }

}
