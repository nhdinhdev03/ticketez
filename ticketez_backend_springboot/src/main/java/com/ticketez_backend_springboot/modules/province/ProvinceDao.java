package com.ticketez_backend_springboot.modules.province;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ticketez_backend_springboot.dto.CinemaComplexToProvinceDTO;

@Repository
public interface ProvinceDao extends JpaRepository<Province, Long> {

    @Query("SELECT p FROM Province p WHERE p.name like CONCAT('%', :name, '%')")
    List<Province> findAllByNameLike(@Param("name") String name);

    @Query("SELECT NEW com.ticketez_backend_springboot.dto.CinemaComplexToProvinceDTO(p.id , " +
            "p.name , " +
            "COALESCE(COUNT(C.id), 0) as TotalCinemaComplex) " +
            "FROM Province p " +
            "LEFT JOIN p.cinemaComplexes C " +
            "GROUP BY p.id, p.name " +
            "HAVING COALESCE(COUNT(C.id), 0) > 0") // chỉ lấy những có dữ liệu
    List<CinemaComplexToProvinceDTO> getTotalCinemaComplexToPrivince();

}
