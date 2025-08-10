package com.ticketez_backend_springboot.modules.article;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import com.ticketez_backend_springboot.dto.ArticleDTO;
import com.ticketez_backend_springboot.dto.ArticleMovieDTO;
import com.ticketez_backend_springboot.dto.ArticleMovieTrueDTO;
import com.ticketez_backend_springboot.dto.ResponseDTO;
import com.ticketez_backend_springboot.modules.articleMovie.ArticleMovie;
import com.ticketez_backend_springboot.modules.articleMovie.ArticleMovieDAO;
import com.ticketez_backend_springboot.modules.articleMovie.ArticleMoviePK;
import com.ticketez_backend_springboot.modules.genre.Genre;
import com.ticketez_backend_springboot.modules.genreMovie.GenreMovie;
import com.ticketez_backend_springboot.modules.movie.Movie;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/article")
public class ArticleAPI {
    @Autowired
    private ArticleDAO dao;
    @Autowired
    private ArticleMovieDAO articleMovieDAO;

    @GetMapping
    public ResponseEntity<ResponseDTO<Article>> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return ResponseEntity.notFound().build();
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Article> page = dao.findAll(pageable);
            ResponseDTO<Article> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleMovieDTO> findById(@PathVariable("id") Long id) {
        try {
            Optional<Article> articleOptional = dao.findById(id);
            if (articleOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Article article = articleOptional.get();
            ArticleMovieDTO articleMovieDTO = new ArticleMovieDTO();
            List<ArticleMovieDTO.MovieObjResp> listMovieObjResp = new ArrayList<>();

            ArticleMovieDTO.MovieObjResp movieObjResp = articleMovieDTO.new MovieObjResp();

            List<ArticleMovieDTO.MovieObjResp.MovieandGens> listMovieandGens = new ArrayList<>();

            for (ArticleMovie articleMovie : article.getArticleMovies()) {
                ArticleMovieDTO.MovieObjResp.MovieandGens movieandGens = movieObjResp.new MovieandGens();

                List<Genre> genres = new ArrayList<>();

                for (GenreMovie genreMovie : articleMovie.getMovie().getGenresMovies()) {
                    genres.add(genreMovie.getGenre());
                }
                movieandGens.setMovie(articleMovie.getMovie());
                movieandGens.setGenres(genres);
                listMovieandGens.add(movieandGens);
            }

            movieObjResp.setArticle(article);
            movieObjResp.setListMovieandGens(listMovieandGens);
            listMovieObjResp.add(movieObjResp);

            articleMovieDTO.setListMovieObjResp(listMovieObjResp);

            return ResponseEntity.ok(articleMovieDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody ArticleDTO articleDTO) {
        List<ArticleMovie> articleMovies = new ArrayList<>();

        try {
            Article articleSaved = dao.save(articleDTO.getArticle());
            for (int i = 0; i < articleDTO.getMovies().size(); i++) {
                ArticleMoviePK articleMoviePK = new ArticleMoviePK();
                articleMoviePK.setArticleId(articleSaved.getId());
                articleMoviePK.setMovieId(articleDTO.getMovies().get(i).getId());
                ArticleMovie articleMovie = new ArticleMovie();
                articleMovie.setArticle(articleSaved);
                articleMovie.setDirectorMoviePK(articleMoviePK);
                articleMovie.setMovie(articleDTO.getMovies().get(i));
                articleMovies.add(articleMovie);
            }

            articleMovieDAO.saveAll(articleMovies);
            return ResponseEntity.ok(articleSaved);
        } catch (Exception e) {
            return new ResponseEntity<>("Không thể thêm, có lỗi trong việc lưu Danh sách phim",
                    HttpStatus.CONFLICT);

        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> put(@PathVariable("id") Long id, @RequestBody ArticleDTO articleDTO) {
        try {
            if (!dao.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            Article articleDB = dao.findById(articleDTO.getArticle().getId()).orElse(null);

            if (!articleDTO.getMovies().isEmpty()) {
                // tìm kiếm movie trong Article ở db
                List<Movie> listMovieInArcticle = articleDB.getArticleMovies().stream()
                        .map(ArticleMovie::getMovie)
                        .collect(Collectors.toList());

                // trên form xoá đi các movie ban đầu
                List<ArticleMovie> listMovie = articleDB.getArticleMovies().stream()
                        .filter(f -> articleDTO.getMovies().stream()
                                .noneMatch(form -> {
                                    return form.getId() == f.getMovie().getId();
                                }))
                        .collect(Collectors.toList());
                // trên form đã thêm các movie mới
                List<ArticleMovie> listArticleMovieCreate = articleDTO.getMovies().stream()
                        .filter(f -> listMovieInArcticle.stream().noneMatch(fInM -> {
                            return fInM.getId() == f.getId();
                        }))
                        .map(movieForm -> {
                            ArticleMovie articleMovie = new ArticleMovie();
                            ArticleMoviePK articleMoviePK = new ArticleMoviePK();
                            articleMoviePK.setArticleId(movieForm.getId());
                            articleMoviePK.setMovieId(articleDB.getId());

                            articleMovie.setArticle(articleDB);
                            articleMovie.setDirectorMoviePK(articleMoviePK);
                            articleMovie.setMovie(movieForm);
                            return articleMovie;
                        }).collect(Collectors.toList());

                if (listMovie.size() > 0) {
                    articleMovieDAO.deleteAll(listMovie);
                }
                if (listArticleMovieCreate.size() > 0) {
                    articleMovieDAO.saveAll(listArticleMovieCreate);
                }
            }
            dao.save(articleDTO.getArticle());
            return ResponseEntity.ok(articleDTO.getArticle());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        try {
            // Lấy thông tin của bài viết cần xóa
            Optional<Article> articleOptional = dao.findById(id);

            if (articleOptional.isPresent()) {
                Article article = articleOptional.get();

                // Xóa tất cả các bản ghi trong bảng ArticleMovies liên quan đến bài viết này
                List<ArticleMovie> articleMovies = article.getArticleMovies();
                if (articleMovies != null && !articleMovies.isEmpty()) {
                    for (ArticleMovie articleMovie : articleMovies) {
                        // Thực hiện xóa từ bảng ArticleMovies
                        articleMovieDAO.delete(articleMovie);
                    }
                }

                // Xóa bài viết từ bảng Articles
                dao.deleteById(id);

                return ResponseEntity.ok().body("Xoá danh sách phim thành công");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bài viết");
            }
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Không thể xóa sự kiện do tài liệu tham khảo hiện có");
        }
    }
    

    @GetMapping("/get/article-movie")
     public ResponseEntity<?> getArticleMovie(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return ResponseEntity.notFound().build();
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Article> page = dao.getArticleMovie(pageable);

            ArticleMovieDTO articleMovieDTO = new ArticleMovieDTO();
            List<ArticleMovieDTO.MovieObjResp> listMovieObjResp = new ArrayList<>();

            for (Article article : page.getContent()) {
                ArticleMovieDTO.MovieObjResp movieObjResp = articleMovieDTO.new MovieObjResp();

                List<ArticleMovieDTO.MovieObjResp.MovieandGens> listMovieandGens = new ArrayList<>();

                for (ArticleMovie articleMovie : article.getArticleMovies()) {
                    ArticleMovieDTO.MovieObjResp.MovieandGens movieandGens = movieObjResp.new MovieandGens();

                    List<Genre> genres = new ArrayList<>();

                    for (GenreMovie genreMovie : articleMovie.getMovie().getGenresMovies()) {
                        genres.add(genreMovie.getGenre());
                    }
                    movieandGens.setMovie(articleMovie.getMovie());
                    movieandGens.setGenres(genres);
                    listMovieandGens.add(movieandGens);
                    // movieList.add(articleMovie.getMovie());
                }

                movieObjResp.setArticle(article);
                movieObjResp.setListMovieandGens(listMovieandGens);
                listMovieObjResp.add(movieObjResp);
            }

            articleMovieDTO.setListMovieObjResp(listMovieObjResp);
            articleMovieDTO.setTotalItems(page.getTotalElements());
            articleMovieDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(articleMovieDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/get/article-movie-true")
    public ResponseEntity<?> getArticleMovieTrue(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return ResponseEntity.notFound().build();
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Article> page = dao.getArticleMovieTrue(pageable);

            ArticleMovieTrueDTO articleMovieDTO = new ArticleMovieTrueDTO();
            List<ArticleMovieTrueDTO.MovieObjResp> listMovieObjResp = new ArrayList<>();

            for (Article article : page.getContent()) {
                ArticleMovieTrueDTO.MovieObjResp movieObjResp = articleMovieDTO.new MovieObjResp();
                List<Movie> movieList = new ArrayList<>();

                for (ArticleMovie articleMovie : article.getArticleMovies()) {
                    movieList.add(articleMovie.getMovie());
                }

                movieObjResp.setArticle(article);
                movieObjResp.setMovies(movieList);
                listMovieObjResp.add(movieObjResp);
            }

            articleMovieDTO.setListMovieObjResp(listMovieObjResp);
            articleMovieDTO.setTotalItems(page.getTotalElements());
            articleMovieDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(articleMovieDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
