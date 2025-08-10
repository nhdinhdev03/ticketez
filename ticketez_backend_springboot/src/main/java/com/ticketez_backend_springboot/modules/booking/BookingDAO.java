package com.ticketez_backend_springboot.modules.booking;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ticketez_backend_springboot.dto.RevenueStatisticsDTO;
import com.ticketez_backend_springboot.modules.account.Account;
import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.paymentInfo.PaymentInfo;
import com.ticketez_backend_springboot.modules.seatBooking.SeatBooking;

@Repository
public interface BookingDAO extends JpaRepository<Booking, String> {
        public List<Booking> findByShowtimeId(Long showtimeId);

        // @Query("SELECT b.id FROM Booking b WHERE b.showtime.id = :showtimeId")
        // List<BookingDTO> findByShowtimeId(Long showtimeId);

        @Query("SELECT new com.ticketez_backend_springboot.dto.RevenueStatisticsDTO( " +
                        " YEAR(b.createDate) as year, MONTH(b.createDate) as month , " +
                        " SUM(sb.price) as amount ) " +
                        " FROM Booking b " +
                        " JOIN b.seatsBookings sb " +
                        " GROUP BY YEAR(b.createDate), MONTH(b.createDate)")
        List<RevenueStatisticsDTO> getRevenueStatisticsDTO();

        // @Query("SELECT new com.ticketez_backend_springboot.dto.TotalDashboardAdmin( "
        // +
        // " COUNT(DISTINCT k.id) AS total_tickets, " +
        // " COUNT(DISTINCT m.id) AS total_movies ) " +
        // " FROM Booking k " +
        // " JOIN " +
        // " k.showtime s" +
        // " JOIN " +
        // " s.formatMovie fm" +
        // " JOIN " +
        // " fm.movie m" +
        // " WHERE k.ticketStatus = 1")
        // List<TotalDashboardAdmin> getTotalTicketsAndTotalMovies();
        @Query("SELECT o FROM Booking o WHERE " +
                        "((o.showtime.formatMovie.movie.title LIKE CONCAT('%', :keyword, '%') OR " +
                        "o.showtime.cinema.cinemaComplex.name LIKE CONCAT('%', :keyword, '%')) AND " +
                        "o.ticketStatus = :ticketStatus) AND o.account.id = :accId")
        Page<Booking> findByMovieName(
                        @Param("keyword") String search,
                        @Param("ticketStatus") Integer ticketStatus,
                        @Param("accId") String accId,
                        Pageable pageable);

        // web cam

        @Query("SELECT b FROM Booking b WHERE b.id = :bookingId")
        Booking getBookingById(@Param("bookingId") String bookingId);

        @Query("SELECT pi FROM PaymentInfo pi WHERE pi.booking.id = :bookingId")
        PaymentInfo getPaymentInfoById(@Param("bookingId") String bookingId);

        @Query("SELECT sb FROM SeatBooking sb WHERE sb.booking.id = :bookingId")
        List<SeatBooking> getSeatsBookingById(@Param("bookingId") String bookingId);

        @Query("SELECT b FROM Booking b " +
                        "JOIN Showtime s ON b.showtime = s " +
                        "JOIN Cinema c ON s.cinema = c " +
                        "JOIN CinemaComplex cc ON c.cinemaComplex = cc " +
                        "JOIN CinemaChain ch ON cc.cinemaChain = ch " +
                        "WHERE ch.id = :cinemaChainId")
        List<Booking> findBookingsByCinemaChainId(@Param("cinemaChainId") Long cinemaChainId);

        // Tìm kiếm các Booking đã thanh toán và có vé sử dụng cho một bộ phim cụ thể và
        // một tài khoản cụ thể
        @Query("SELECT b FROM Booking b " +
                        "JOIN b.showtime.formatMovie fm " +
                        "WHERE b.status = 0 AND b.ticketStatus = 1 AND fm.movie = :movie AND b.account = :account")
        List<Booking> findPaidAndUsedBookingsByMovieAndAccount(
                        @Param("movie") Movie movie,
                        @Param("account") Account account);

}
