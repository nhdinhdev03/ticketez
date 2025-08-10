package com.ticketez_backend_springboot.modules.account;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
// 
import com.ticketez_backend_springboot.dto.AccountDTO;
import com.ticketez_backend_springboot.dto.TotalDashboardAdmin;

public interface AccountDAO extends JpaRepository<Account, String> {
        // WHERE a.role = 0 ORDER BY a.active DESC
        // @Query("SELECT new com.ticketez_backend_springboot.dto.AccountDTO( a.phone,
        // a.fullname, a.email, a.birthday, a.gender, a.image, a.role, a.verified) FROM
        // Account a "
        // +"WHERE a.role = false AND a.active = :active AND a.fullname like CONCAT('%',
        // :search, '%') ORDER BY a.active DESC")
        // Page<AccountDTO> getAllRoleUserAndActive(Pageable pageable, @Param("active")
        // Boolean active, @Param("search") String search);

        @Query("SELECT new com.ticketez_backend_springboot.dto.AccountDTO( a.id, a.phone, a.fullname, a.email, a.birthday, a.gender, a.image, a.status, a.address, a.verified) "
                        + "FROM Account a JOIN a.accountRoles ar "
                        + "WHERE ar.role.id = 2 AND a.fullname like CONCAT('%', :search, '%') AND a.status = :status  ORDER BY a.createdDate DESC")
        Page<AccountDTO> getAllRoleUserAndActive(Pageable pageable, @Param("status") Integer status,
                        @Param("search") String search);

        // List<Account> findAllByOrderByPhoneDesc ();
        List<Account> findAllByOrderByCreatedDateDesc();

        @Query("SELECT new com.ticketez_backend_springboot.dto.TotalDashboardAdmin ( " +
                        " COUNT(a.id) as total_user )" +
                        " FROM Account a " +
                        " JOIN " +
                        " AccountRole ar on ar.account.id = a.id" +
                        " WHERE ar.role.id = 2")
        List<TotalDashboardAdmin> getTotalUser();

        @Query(value = "WITH GenreRank AS ( " +
                        "    SELECT " +
                        "        a.id 'userId', " +
                        "        g.name AS'theloai', " +
                        // " m.id AS 'phim', " +
                        "        COUNT(g.name) AS 'sl', " +
                        "        RANK() OVER (PARTITION BY a.id ORDER BY COUNT(g.name) DESC) AS rnk, " +
                        "  ROW_NUMBER() OVER (PARTITION BY a.id ORDER BY COUNT(g.name) DESC) AS row_num_within_user " +
                        "    FROM " +
                        "        dbo.Accounts a " +
                        "        INNER JOIN dbo.Booking b ON b.account_id = a.id " +
                        "        INNER JOIN dbo.Showtimes st ON st.id = b.showtime_id " +
                        "        INNER JOIN dbo.Formats_Movies fm ON fm.id = st.format_movie_id " +
                        "        INNER JOIN dbo.Movies m ON m.id = fm.movie_id " +
                        "        INNER JOIN dbo.Genres_Movies gm ON gm.movie_id = m.id " +
                        "        INNER JOIN dbo.Genres g ON g.id = gm.genre_id " +
                        " WHERE b.ticket_status = 1 " +
                        "    GROUP BY " +
                        "        a.id, " +
                        "        g.name " +
                        // " m.id " +
                        ") " +
                        "SELECT * FROM dbo.Accounts accounts WHERE EXISTS ( " +
                        "  SELECT gr.userId, gr.theloai, gr.sl " +
                        "  FROM GenreRank gr " +
                        "  WHERE accounts.id = gr.userId AND gr.rnk = 1 AND gr.row_num_within_user = 1 AND EXISTS ( " +
                        "  SELECT * FROM dbo.Genres g INNER JOIN dbo.Genres_Movies gm ON gm.genre_id = g.id " +
                        "  INNER JOIN dbo.Movies m ON m.id = gm.movie_id " +
                        "  WHERE m.id = :movieId AND gr.theloai = g.name  " +
                        "  ) " +
                        ")", nativeQuery = true)
        List<Account> listAccount(@Param("movieId") Long movieId);

}
