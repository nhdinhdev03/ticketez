package com.ticketez_backend_springboot.modules.formatMovie;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ticketez_backend_springboot.modules.format.Format;
import com.ticketez_backend_springboot.modules.format.FormatDAO;
import com.ticketez_backend_springboot.modules.movie.Movie;
import com.ticketez_backend_springboot.modules.movie.MovieDAO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/formatMovie")
public class FormatMovieAPI {

    @Autowired
    FormatMovieDAO dao;
    @Autowired
    FormatDAO daoFormat;
    @Autowired
    MovieDAO daoMovie;

    @GetMapping
    public ResponseEntity<List<FormatMovie>> getAll() {
        List<FormatMovie> genreMovie = dao.findAll();
        return ResponseEntity.ok(genreMovie);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") Long id) {
        if (!dao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dao.findById(id).get());
    }

    @GetMapping("by-formatId/{formatId}")
    public List<FormatMovie> getFormatMoviesByFormatId(@PathVariable("formatId") Long formatId) {
        return dao.findByFormatId(formatId);
    }

    @GetMapping("/getDistinctMovie")
    public ResponseEntity<?> getDistinctMovie() {
        List<Movie> distinctMovieIds = dao.getDistinctMovie();
        // Sắp xếp danh sách giảm dần theo id
        Collections.sort(distinctMovieIds, (movie1, movie2) -> movie2.getId().compareTo(movie1.getId()));
        return ResponseEntity.ok(distinctMovieIds);
    }

    @GetMapping("/getDistinctFormat/{movieId}")
    public ResponseEntity<?> getDistinctFormats(@PathVariable("movieId") long movieId) {
        try {
            Movie movie = daoMovie.findById(movieId).get();
            List<Format> distinctMovieIds = dao.getDistinctFormats(movie);
            Collections.sort(distinctMovieIds, (movie1, movie2) -> movie2.getId().compareTo(movie1.getId()));
            return ResponseEntity.ok(distinctMovieIds);
        } catch (Exception e) {
            // Xử lý lỗi kết nối cơ sở dữ liệu
            String errorMessage = "Lỗi kết nối cơ sở dữ liệu: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    // lấy id của formatmovie dựa theo id của movie và format
    // @GetMapping("/get/IdFormatMovieByFormatAndMovie/{movieId}/{formatId}")
    // public ResponseEntity<?>
    // getIdFormatMovieByFormatAndMovie(@PathVariable("movieId") long movieId,
    // @PathVariable("formatId") long formatId) {
    // try {
    // List<FormatMovie> formatMovies = dao.getIdFoMatMvoie(movieId, formatId);

    // if (!formatMovies.isEmpty()) {
    // // Giả sử bạn muốn truy cập phần tử đầu tiên
    // FormatMovie formatMovie = formatMovies.get(0);
    // // Bây giờ bạn có thể làm điều gì đó với formatMovie
    // return ResponseEntity.ok(formatMovie);
    // } else {
    // return new ResponseEntity<>("Lỗi ", HttpStatus.NOT_FOUND);
    // }
    // } catch (Exception e) {
    // return new ResponseEntity<>("Lỗi kết nối server",
    // HttpStatus.INTERNAL_SERVER_ERROR);
    // }
    // }
    @GetMapping("/get/IdFormatMovieByFormatAndMovie/{movieId}/{formatId}")
    public ResponseEntity<?> getIdFormatMovie(@PathVariable("movieId") long movieId,
            @PathVariable("formatId") long formatId) {
        try {
            Movie movie = daoMovie.findById(movieId).get();
            Format format = daoFormat.findById(formatId).get();
            if (movie != null) {
                List<FormatMovie> formatMovie = dao.getIdFoMatMvoie(movie, format);
                return ResponseEntity.ok(formatMovie);
            }
            return new ResponseEntity<>("Lỗi ", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // Xử lý lỗi kết nối cơ sở dữ liệu
            String errorMessage = "Lỗi kết nối cơ sở dữ liệu: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    @GetMapping("/getMovieByGenres/{movieId}")
    public ResponseEntity<?> getDistinctMovie(@PathVariable("movieId") long movieId) {
        List<FormatMovie> distinctMovieIds = dao.getMoviesByGenre(movieId);
        return ResponseEntity.ok(distinctMovieIds);
    }

}
