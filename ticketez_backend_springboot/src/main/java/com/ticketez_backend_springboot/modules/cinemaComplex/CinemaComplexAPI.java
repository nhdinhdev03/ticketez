package com.ticketez_backend_springboot.modules.cinemaComplex;

import java.time.LocalDate;
import java.util.ArrayList;
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

import com.ticketez_backend_springboot.dto.CinemaToCinemaComplexDTO;
import com.ticketez_backend_springboot.dto.ResponseDTO;
import com.ticketez_backend_springboot.modules.province.Province;
import com.ticketez_backend_springboot.modules.province.ProvinceDao;
import com.ticketez_backend_springboot.dto.CCXShowtimeByMovieDTO;
import com.ticketez_backend_springboot.dto.CinemaChainBookingDTO;
import com.ticketez_backend_springboot.dto.CinemaComplexBookingDTO;
import com.ticketez_backend_springboot.modules.booking.Booking;
import com.ticketez_backend_springboot.modules.booking.BookingDAO;
import com.ticketez_backend_springboot.modules.cinemaChain.CinemaChain;
import com.ticketez_backend_springboot.modules.formatMovie.FormatMovie;
import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.movie.MovieDAO;
import com.ticketez_backend_springboot.modules.paymentInfo.PaymentInfo;
import com.ticketez_backend_springboot.modules.paymentInfo.PaymentInfoDAO;
import com.ticketez_backend_springboot.modules.showtime.Showtime;
import com.ticketez_backend_springboot.modules.showtime.ShowtimeDAO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/cinemaComplex")
public class CinemaComplexAPI {
    @Autowired
    CinemaComplexDao cinemaComplexDao;
    @Autowired
    ProvinceDao provinceDao;

    @Autowired
    private PaymentInfoDAO dao;

    @Autowired
    MovieDAO movieDAO;
    @Autowired
    ShowtimeDAO showtimeDao;

    @Autowired
    private BookingDAO bookingDao;

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<CinemaComplex> page = cinemaComplexDao.findAll(pageable);
            ResponseDTO<CinemaComplex> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<CinemaComplex>> findAll() {
        List<CinemaComplex> seats = cinemaComplexDao.findAllByOrderByIdDesc();
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/bycimemaChain/{idCinemaChain}")
    public ResponseEntity<List<CinemaComplex>> findAllByCinemaChain(@PathVariable("idCinemaChain") Long id) {
        List<CinemaComplex> seats = cinemaComplexDao.findByCinemaChainId(id);
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") Long id) {
        try {
            if (!cinemaComplexDao.existsById(id)) {
                return new ResponseEntity<>("Không tìm thấy cụm rạp", HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(cinemaComplexDao.findById(id).get());
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody CinemaComplex cinemaComplex) {
        try {
            cinemaComplexDao.save(cinemaComplex);
            return ResponseEntity.ok(cinemaComplex);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(@PathVariable("id") Long id, @RequestBody CinemaComplex cinemaComplex) {
        try {
            if (!cinemaComplexDao.existsById(id)) {
                return new ResponseEntity<>("Cụm Rạp không tồn tại", HttpStatus.NOT_FOUND);
            }
            cinemaComplexDao.save(cinemaComplex);
            return ResponseEntity.ok(cinemaComplex);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            cinemaComplexDao.deleteById(id);
            return ResponseEntity.ok().body("Xoá cụm rạp thành công");
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Không thể xóa", HttpStatus.CONFLICT);
        }

    }

    // ----------------------------------------------------------------

    @GetMapping("/get/get-cinemaComplex-by-provinceId-cinemaChainName-searchNameCCX")
    public ResponseEntity<?> getDuLie(@RequestParam("results") Optional<Integer> results,
            @RequestParam("provinceId") Optional<Integer> provinceId,
            @RequestParam("cinemaChainName") Optional<String> cinemaChainName,
            @RequestParam("searchNameCCX") Optional<String> searchNameCCX) {

        try {
            if (cinemaChainName.isPresent() && cinemaChainName.get() == ""
                    || cinemaChainName.get().equalsIgnoreCase("tất cả")) {
                cinemaChainName = Optional.empty();
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(0, results.orElse(999), sort);
            Page<CinemaComplex> page = cinemaComplexDao.getCinemaComplexByProvinceIdAndCinemaChainNameAndSearchNameCCX(
                    pageable, provinceId.orElse(2),
                    cinemaChainName.orElse(""), searchNameCCX.orElse(""));
            ResponseDTO<CinemaComplex> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // hiển thị tổng cinema theo cinemacomplex
    @GetMapping("/getTotalCinemaToCinemaComplex")
    public ResponseEntity<?> getTotalCinemaToCinemaComplex() {
        List<CinemaToCinemaComplexDTO> distinctMovieIds = cinemaComplexDao.getTotalCinemaToCinemaComplex();
        return ResponseEntity.ok(distinctMovieIds);
    }

    //
    @GetMapping("/get/cinemaComplex-by-province/{provinceID}")
    public ResponseEntity<?> getDuLie(@PathVariable("provinceID") long provinceID) {
        try {
            Province province = provinceDao.findById(provinceID).get();
            if (province != null) {
                List<CinemaComplex> provinceDAO = cinemaComplexDao.getCinemaComplexByProvince(province);
                return ResponseEntity.ok(provinceDAO);
            }
            return new ResponseEntity<>("Lỗi ", HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // @GetMapping("/get/gettesst")
    @GetMapping("/get/ccx-format-showtime-by-movie")
    public ResponseEntity<?> getDuLiea(
            @RequestParam("date") Optional<LocalDate> date,
            @RequestParam("provinceId") Long provinceId,
            @RequestParam("cinemaChainName") Optional<String> cinemaChainName,
            @RequestParam("movieId") Long movieId) {

        try {
            if (cinemaChainName.isPresent() && cinemaChainName.get() == ""
                    || cinemaChainName.get().equalsIgnoreCase("tất cả")) {
                cinemaChainName = Optional.empty();
            }
            if (movieId.equals("")) {
                return new ResponseEntity<>("Lỗi", HttpStatus.NOT_FOUND);
            }
            Movie movie = movieDAO.findById(movieId).get();

            List<CinemaComplex> cinemaComplexs = cinemaComplexDao.getCinemaComplexAndFormatShowtimesByMovie(provinceId,
                    cinemaChainName.orElse(""), movie,
                    date.orElse(LocalDate.now()));
            if (cinemaComplexs.isEmpty()) {
                return ResponseEntity.ok(new ArrayList<>());
            }
            CCXShowtimeByMovieDTO abc = new CCXShowtimeByMovieDTO();
            List<CCXShowtimeByMovieDTO.CinemaComplexObjResp> listCinemaComplexObjResp = new ArrayList<>();

            for (CinemaComplex cinemaComplex : cinemaComplexs) {
                CCXShowtimeByMovieDTO.CinemaComplexObjResp cinemaComplexObjResp = abc.new CinemaComplexObjResp();

                List<CCXShowtimeByMovieDTO.CinemaComplexObjResp.FormatAndShowtimes> lisFormatAndShowtimes = new ArrayList<>();

                for (FormatMovie formatMovie : movie.getFormatsMovies()) {
                    CCXShowtimeByMovieDTO.CinemaComplexObjResp.FormatAndShowtimes formatAndShowtimes = cinemaComplexObjResp.new FormatAndShowtimes();
                    formatAndShowtimes.setFormat(formatMovie.getFormat());

                    List<Showtime> showtime = showtimeDao.getShowtimesByCCXAndMovieAndFormatAndDate(cinemaComplex,
                            movie, formatMovie.getFormat(), date.orElse(LocalDate.now()));

                    formatAndShowtimes.setShowtimes(showtime);
                    lisFormatAndShowtimes.add(formatAndShowtimes);
                }

                cinemaComplexObjResp.setCinemaComplex(cinemaComplex);
                cinemaComplexObjResp.setListFormatAndShowtimes(lisFormatAndShowtimes);

                listCinemaComplexObjResp.add(cinemaComplexObjResp);
                abc.setCinemaComplexObjResps(listCinemaComplexObjResp);
            }

            return ResponseEntity.ok(abc);
        } catch (Exception e) {
            return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/cinemaComplexBookingDTO")
    public ResponseEntity<List<CinemaComplexBookingDTO>> findAllCinemaComplexAndBookingDTO() {
        List<CinemaComplex> cinemaComplexs = cinemaComplexDao.findAll();
        List<CinemaComplexBookingDTO> rspList = new ArrayList<>();
        for (CinemaComplex cinemaComplex : cinemaComplexs) {
            List<PaymentInfo> paymentss = new ArrayList<>();
            CinemaComplexBookingDTO bookingDTO = new CinemaComplexBookingDTO();

            List<Booking> bookings = bookingDao.findBookingsByCinemaChainId(cinemaComplex.getId());
            for (Booking booking : bookings) {
                PaymentInfo payment = dao.findByBookingId(booking.getId());
                if (payment != null) {
                    paymentss.add(payment);
                }
            }
            float totalPrice = (float) paymentss.stream()
                    .filter(payment -> payment != null && payment.getAmount() != null)
                    .mapToDouble(PaymentInfo::getAmount)
                    .sum();

            bookingDTO.setCinemaComplex(cinemaComplex);
            bookingDTO.setBookings(bookings);
            bookingDTO.setPayments(paymentss);
            bookingDTO.setTotalPrice(totalPrice);

            rspList.add(bookingDTO);
        }

        return ResponseEntity.ok(rspList);
    }

}
