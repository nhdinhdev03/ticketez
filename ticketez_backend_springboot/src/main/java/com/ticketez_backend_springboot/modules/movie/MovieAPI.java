package com.ticketez_backend_springboot.modules.movie;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.TransientDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.JpaSystemException;
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

import com.ticketez_backend_springboot.dto.ActorAndDirectorDTO;
import com.ticketez_backend_springboot.dto.MovieByShowtimeShowingDTO;
import com.ticketez_backend_springboot.dto.MovieDTO;
import com.ticketez_backend_springboot.dto.MovieShowtimeDTO;
import com.ticketez_backend_springboot.dto.ResponseDTO;
import com.ticketez_backend_springboot.dto.SearchMovieDTO;
import com.ticketez_backend_springboot.dto.TotalDashboardAdmin;
import com.ticketez_backend_springboot.modules.actor.Actor;
import com.ticketez_backend_springboot.modules.actorMovie.ActorMovie;
import com.ticketez_backend_springboot.modules.actorMovie.ActorMovieDAO;
import com.ticketez_backend_springboot.modules.actorMovie.ActorMoviePK;
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplex;
import com.ticketez_backend_springboot.modules.cinemaComplex.CinemaComplexDao;
import com.ticketez_backend_springboot.modules.director.Director;
import com.ticketez_backend_springboot.modules.directorMovie.DirectorMovie;
import com.ticketez_backend_springboot.modules.directorMovie.DirectorMovieDAO;
import com.ticketez_backend_springboot.modules.directorMovie.DirectorMoviePK;
import com.ticketez_backend_springboot.modules.formatMovie.FormatMovie;
import com.ticketez_backend_springboot.modules.formatMovie.FormatMovieDAO;
import com.ticketez_backend_springboot.modules.genre.Genre;
import com.ticketez_backend_springboot.modules.genreMovie.GenreMovie;
import com.ticketez_backend_springboot.modules.genreMovie.GenreMovieDAO;
import com.ticketez_backend_springboot.modules.genreMovie.GenreMoviePK;
import com.ticketez_backend_springboot.modules.movieProducer.MovieProducer;
import com.ticketez_backend_springboot.modules.movieProducer.MovieProducerDAO;
import com.ticketez_backend_springboot.modules.movieProducer.MovieProducerPK;
import com.ticketez_backend_springboot.modules.movieStudio.MovieStudio;
import com.ticketez_backend_springboot.modules.movieStudio.MovieStudioDAO;
import com.ticketez_backend_springboot.modules.movieStudio.MovieStudioPK;
import com.ticketez_backend_springboot.modules.producer.Producer;
import com.ticketez_backend_springboot.service.UploadImageService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;

import com.ticketez_backend_springboot.modules.format.Format;
import com.ticketez_backend_springboot.modules.showtime.Showtime;
import com.ticketez_backend_springboot.modules.showtime.ShowtimeDAO;
import com.ticketez_backend_springboot.modules.studio.Studio;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/movie")
public class MovieAPI {
    @Autowired
    MovieDAO dao;
    private static final Logger logger = LoggerFactory.getLogger(MovieAPI.class);

    @Autowired
    FormatMovieDAO formatMovieDAO;
    @Autowired
    GenreMovieDAO genreMovieDAO;
    @Autowired
    MovieStudioDAO movieStudioDAO;
    @Autowired
    MovieProducerDAO movieProducerDAO;
    @Autowired
    DirectorMovieDAO directorMovieDAO;
    @Autowired
    ActorMovieDAO actorMovieDAO;

    @Autowired
    CinemaComplexDao cinemaComplexDao;

    @Autowired
    ShowtimeDAO showtimeDao;

    @GetMapping
    public ResponseEntity<?> findByPage(
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit,
            @RequestParam("search") Optional<String> search) {
        try {

            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Số trang không tồn tại!", HttpStatus.BAD_REQUEST);
            }
            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Movie> page = dao.findByKeyword(search.orElse(""), pageable);
            ResponseDTO<Movie> responeDTO = new ResponseDTO<>();
            responeDTO.setData(page.getContent());
            responeDTO.setTotalItems(page.getTotalElements());
            responeDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(responeDTO);

        } catch (TransientDataAccessException ex) {
            logger.error("==> Loi ket noi voi database: {}", ex.toString());
            return new ResponseEntity<>("Kết nối database bị đóng tạm thời", HttpStatus.BAD_REQUEST);
        } catch (JpaSystemException ex) {
            logger.error("==> Loi JpaSystemException: {}", ex.toString());
            return new ResponseEntity<>("Có lỗi trong Movie, hãy kiểm tra kiểu dữ liệu!",
                    HttpStatus.BAD_REQUEST);
        } catch (EntityNotFoundException ex) {
            logger.error("==> Khong tim thay doi tuong Movie: {}", ex.toString());
            return new ResponseEntity<>("Không tìm thấy đối tượng Movie!", HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            logger.error("==> Xay ra loi trong Movie API chua xac dinh!: {}", ex.toString());
            return new ResponseEntity<>("Có lỗi trong Movie API vui lòng liên hệ quản trị viên",
                    HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<Movie>> findAll() {
        List<Movie> movies = dao.findAllByOrderByIdDesc();
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") Long id) {
        try {

            if (!dao.existsById(id)) {

                return new ResponseEntity<>("Không tìm thấy phim", HttpStatus.NOT_FOUND);
            }

            Movie movie = dao.findById(id).get();

            List<Actor> actors = new ArrayList<>();
            List<Director> directors = new ArrayList<>();
            List<Format> formats = new ArrayList<>();
            List<Genre> genres = new ArrayList<>();
            List<Studio> studios = new ArrayList<>();
            List<Producer> producers = new ArrayList<>();

            for (ActorMovie actorMovie : movie.getActorsMovies()) {
                actors.add(actorMovie.getActor());
            }
            for (DirectorMovie directorMovie : movie.getDirectorsMovies()) {
                directors.add(directorMovie.getDirector());
            }
            for (FormatMovie formatMovie : movie.getFormatsMovies()) {
                formats.add(formatMovie.getFormat());
            }
            for (GenreMovie genreMovie : movie.getGenresMovies()) {
                genres.add(genreMovie.getGenre());
            }
            for (MovieProducer movieProducer : movie.getMoviesProducers()) {
                producers.add(movieProducer.getProducer());
            }
            for (MovieStudio movieStudio : movie.getMoviesStudios()) {
                studios.add(movieStudio.getStudio());
            }

            MovieDTO resp = new MovieDTO();
            resp.setActors(actors);
            resp.setDirectors(directors);
            resp.setFormats(formats);
            resp.setGenres(genres);
            resp.setMovie(movie);
            resp.setProducers(producers);
            resp.setStudios(studios);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            logger.error("[GET - Id] - Error: {}", e.toString());
            return new ResponseEntity<>("Có lỗi, Lỗi trong việc tìm Movie",
                    HttpStatus.CONFLICT);
        }
    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody MovieDTO moviedDto) {

        List<ActorMovie> actorMovies = new ArrayList<>();
        List<DirectorMovie> directorMovies = new ArrayList<>();
        List<GenreMovie> genreMovies = new ArrayList<>();
        List<FormatMovie> formatMovies = new ArrayList<>();
        List<MovieProducer> movieProducers = new ArrayList<>();
        List<MovieStudio> movieStudios = new ArrayList<>();
        try {
            Movie movieSaved = dao.save(moviedDto.getMovie());
            // System.out.println("----Movie " +movieSaved);
            for (int i = 0; i < moviedDto.getActors().size(); i++) {
                ActorMoviePK actorMoviePK = new ActorMoviePK(moviedDto.getActors().get(i).getId(), movieSaved.getId());
                ActorMovie actorMovie = new ActorMovie(actorMoviePK, moviedDto.getActors().get(i),
                        movieSaved);
                actorMovies.add(actorMovie);
            }

            for (int i = 0; i < moviedDto.getDirectors().size(); i++) {
                DirectorMoviePK directorMoviePK = new DirectorMoviePK(moviedDto.getDirectors().get(i).getId(),
                        movieSaved.getId());
                DirectorMovie directorMovie = new DirectorMovie(directorMoviePK, moviedDto.getDirectors().get(i),
                        movieSaved);
                directorMovies.add(directorMovie);
            }

            for (int i = 0; i < moviedDto.getGenres().size(); i++) {
                GenreMoviePK genreMoviePK = new GenreMoviePK(moviedDto.getGenres().get(i).getId(),
                        movieSaved.getId());
                GenreMovie genreMovie = new GenreMovie(genreMoviePK, moviedDto.getGenres().get(i),
                        movieSaved);
                genreMovies.add(genreMovie);
            }

            for (int i = 0; i < moviedDto.getFormats().size(); i++) {
                FormatMovie formatMovie = new FormatMovie();
                formatMovie.setFormat(moviedDto.getFormats().get(i));
                formatMovie.setMovie(movieSaved);
                formatMovies.add(formatMovie);
            }
            for (int i = 0; i < moviedDto.getProducers().size(); i++) {
                MovieProducerPK movieProducerPK = new MovieProducerPK();
                movieProducerPK.setMovieId(movieSaved.getId());
                movieProducerPK.setProducerId(moviedDto.getProducers().get(i).getId());
                MovieProducer movieProducer = new MovieProducer(movieProducerPK, movieSaved,
                        moviedDto.getProducers().get(i));
                movieProducers.add(movieProducer);
            }
            for (int i = 0; i < moviedDto.getStudios().size(); i++) {
                MovieStudioPK movieStudioPK = new MovieStudioPK();
                movieStudioPK.setMovieId(movieSaved.getId());
                movieStudioPK.setStudioId(moviedDto.getProducers().get(i).getId());
                MovieStudio movieStudio = new MovieStudio(movieStudioPK, movieSaved,
                        moviedDto.getStudios().get(i));
                movieStudios.add(movieStudio);
            }
            // System.out.println("---- formarMovie "+ formatMovies);
            formatMovieDAO.saveAll(formatMovies);
            directorMovieDAO.saveAll(directorMovies);
            genreMovieDAO.saveAll(genreMovies);
            movieProducerDAO.saveAll(movieProducers);
            movieStudioDAO.saveAll(movieStudios);
            actorMovieDAO.saveAll(actorMovies);
            return ResponseEntity.ok(movieSaved);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("[POST] - Error: {}", e.toString());
            return new ResponseEntity<>("Không thể thêm, có lỗi trong việc lưu Movie",
                    HttpStatus.CONFLICT);

        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(@PathVariable("id") Long id, @RequestBody MovieDTO movieDTO) {
        try {

            Movie movieDb = dao.findById(movieDTO.getMovie().getId()).orElse(null);
            if (movieDb == null) {
                return new ResponseEntity<>("Có lỗi, Không tìm thấy phim trong cơ sở dữ liệu",
                        HttpStatus.NOT_FOUND);
            }
            Movie movieForm = movieDTO.getMovie();

            if (!movieDTO.getFormats().isEmpty()) {
                List<Format> listFormatInMovie = movieDb.getFormatsMovies().stream()
                        .map(FormatMovie::getFormat)
                        .collect(Collectors.toList());

                // List<FormatMovie> listFormatMovieDel = movieDb.getFormatsMovies().stream()
                // .filter(f -> movieDTO.getFormats().stream()
                // .noneMatch(form -> form.getId() == f.getId()))
                // .collect(Collectors.toList());
                List<FormatMovie> listFormatMovieDel = movieDb.getFormatsMovies().stream()
                        .filter(f -> movieDTO.getFormats().stream()
                                .noneMatch(form -> {
                                    return form.getId() == f.getFormat().getId();
                                }))
                        .collect(Collectors.toList());
                List<FormatMovie> listFormatMovieCreate = movieDTO.getFormats().stream()
                        .filter(f -> listFormatInMovie.stream().noneMatch(fInM -> {
                            return fInM.getId() == f.getId();
                        }))
                        .map(formatForm -> {
                            FormatMovie formatMovie = new FormatMovie();
                            formatMovie.setFormat(formatForm);
                            formatMovie.setMovie(movieForm);
                            return formatMovie;
                        }).collect(Collectors.toList());

                if (listFormatMovieDel.size() > 0) {
                    formatMovieDAO.deleteAll(listFormatMovieDel);
                }
                if (listFormatMovieCreate.size() > 0) {
                    formatMovieDAO.saveAll(listFormatMovieCreate);
                }
            }
            if (!movieDTO.getGenres().isEmpty()) {
                List<Genre> listGenreInMovie = movieDb.getGenresMovies().stream()
                        .map(GenreMovie::getGenre)
                        .collect(Collectors.toList());

                List<GenreMovie> listGenreMovieDel = movieDb.getGenresMovies().stream()
                        .filter(f -> movieDTO.getGenres().stream()
                                .noneMatch(form -> {
                                    return form.getId() == f.getGenre().getId();
                                }))
                        .collect(Collectors.toList());

                List<GenreMovie> listGenreMovieCreate = movieDTO.getGenres().stream()
                        .filter(f -> listGenreInMovie.stream().noneMatch(fInM -> {
                            return fInM.getId() == f.getId();
                        }))
                        .map(genreForm -> {
                            GenreMovie genreMovie = new GenreMovie();
                            GenreMoviePK genreMoviePK = new GenreMoviePK();
                            genreMoviePK.setGenre_id(genreForm.getId());
                            genreMoviePK.setMovieId(movieForm.getId());

                            genreMovie.setGenreMoviePK(genreMoviePK);
                            genreMovie.setGenre(genreForm);
                            genreMovie.setMovie(movieForm);
                            return genreMovie;
                        }).collect(Collectors.toList());

                if (listGenreMovieDel.size() > 0) {
                    genreMovieDAO.deleteAll(listGenreMovieDel);
                }
                if (listGenreMovieCreate.size() > 0) {
                    genreMovieDAO.saveAll(listGenreMovieCreate);
                }
            }
            if (!movieDTO.getActors().isEmpty()) {
                // Tìm kiếm Actor trong Movie ở database
                List<Actor> listActorsInMovie = movieDb.getActorsMovies().stream()
                        .map(ActorMovie::getActor)
                        .collect(Collectors.toList());

                // Trên form xóa đi các actor ban đầu của movie
                List<ActorMovie> listActorMovieDel = movieDb.getActorsMovies().stream()
                        .filter(f -> movieDTO.getActors().stream()
                                .noneMatch(form -> {
                                    return form.getId() == f.getActor().getId();
                                }))
                        .collect(Collectors.toList());

                // Trên form đã thêm các actor mới
                List<ActorMovie> listActorMovieCreate = movieDTO.getActors().stream()
                        .filter(f -> listActorsInMovie.stream().noneMatch(fInM -> {
                            return fInM.getId() == f.getId();
                        }))
                        .map(actorForm -> {
                            ActorMovie actorMovie = new ActorMovie();
                            ActorMoviePK actorMoviePK = new ActorMoviePK();
                            actorMoviePK.setActorId(actorForm.getId());
                            actorMoviePK.setMovieId(movieForm.getId());

                            actorMovie.setActorMoviePK(actorMoviePK);
                            actorMovie.setActor(actorForm);
                            actorMovie.setMovie(movieForm);
                            return actorMovie;
                        }).collect(Collectors.toList());

                if (listActorMovieDel.size() > 0) {
                    actorMovieDAO.deleteAll(listActorMovieDel);
                }
                if (listActorMovieCreate.size() > 0) {
                    actorMovieDAO.saveAll(listActorMovieCreate);
                }
            }
            if (!movieDTO.getDirectors().isEmpty()) {
                List<Director> listDirectorsInMovie = movieDb.getDirectorsMovies().stream()
                        .map(DirectorMovie::getDirector)
                        .collect(Collectors.toList());

                List<DirectorMovie> listDirectorMovieDel = movieDb.getDirectorsMovies().stream()
                        .filter(f -> movieDTO.getDirectors().stream()
                                .noneMatch(form -> {
                                    return form.getId() == f.getDirector().getId();
                                }))
                        .collect(Collectors.toList());

                List<DirectorMovie> listDirectorsMovieCreate = movieDTO.getDirectors().stream()
                        .filter(f -> listDirectorsInMovie.stream().noneMatch(fInM -> {
                            return fInM.getId() == f.getId();
                        }))
                        .map(directorForm -> {
                            DirectorMovie directorMovie = new DirectorMovie();
                            DirectorMoviePK directorMoviePK = new DirectorMoviePK();
                            directorMoviePK.setDirectorId(directorForm.getId());
                            directorMoviePK.setMovieId(movieForm.getId());

                            directorMovie.setDirectorMoviePK(directorMoviePK);
                            directorMovie.setDirector(directorForm);
                            directorMovie.setMovie(movieForm);
                            return directorMovie;
                        }).collect(Collectors.toList());

                if (listDirectorMovieDel.size() > 0) {
                    directorMovieDAO.deleteAll(listDirectorMovieDel);
                }
                if (listDirectorsMovieCreate.size() > 0) {
                    directorMovieDAO.saveAll(listDirectorsMovieCreate);
                }
            }
            if (!movieDTO.getProducers().isEmpty()) {
                List<Producer> listProducersInMovie = movieDb.getMoviesProducers().stream()
                        .map(MovieProducer::getProducer)
                        .collect(Collectors.toList());

                List<MovieProducer> listProducerMovieDel = movieDb.getMoviesProducers().stream()
                        .filter(o -> movieDTO.getProducers().stream()
                                .noneMatch(form -> {
                                    return form.getId() == o.getProducer().getId();
                                }))
                        .collect(Collectors.toList());

                List<MovieProducer> listMovieProducerCreate = movieDTO.getProducers().stream()
                        .filter(o -> listProducersInMovie.stream().noneMatch(oInM -> {
                            return oInM.getId() == o.getId();
                        }))
                        .map(producerForm -> {
                            System.out.println("------------------------- producerForm 427 " + producerForm);
                            MovieProducer movieProducer = new MovieProducer();
                            MovieProducerPK movieProducerPK = new MovieProducerPK();
                            movieProducerPK.setProducerId(producerForm.getId());
                            movieProducerPK.setMovieId(movieForm.getId());

                            movieProducer.setMovieProducerPK(movieProducerPK);
                            movieProducer.setProducer(producerForm);
                            movieProducer.setMovie(movieForm);
                            return movieProducer;
                        }).collect(Collectors.toList());

                if (listProducerMovieDel.size() > 0) {
                    movieProducerDAO.deleteAll(listProducerMovieDel);
                }
                if (listMovieProducerCreate.size() > 0) {
                    movieProducerDAO.saveAll(listMovieProducerCreate);
                }
            }
            if (!movieDTO.getStudios().isEmpty()) {
                List<Studio> listStudioInMovie = movieDb.getMoviesStudios().stream()
                        .map(MovieStudio::getStudio)
                        .collect(Collectors.toList());

                List<MovieStudio> listStudioMovieDel = movieDb.getMoviesStudios().stream()
                        .filter(o -> movieDTO.getStudios().stream()
                                .noneMatch(form -> {
                                    return form.getId() == o.getStudio().getId();
                                }))
                        .collect(Collectors.toList());

                List<MovieStudio> listMovieStudioCreate = movieDTO.getStudios().stream()
                        .filter(o -> listStudioInMovie.stream().noneMatch(oInM -> {
                            return oInM.getId() == o.getId();
                        }))
                        .map(studioForm -> {
                            MovieStudio movieStudio = new MovieStudio();
                            MovieStudioPK movieStudioPK = new MovieStudioPK();
                            movieStudioPK.setStudioId(studioForm.getId());
                            movieStudioPK.setMovieId(movieForm.getId());

                            movieStudio.setMovieStudioPK(movieStudioPK);
                            movieStudio.setStudio(studioForm);
                            movieStudio.setMovie(movieForm);
                            return movieStudio;
                        }).collect(Collectors.toList());

                if (listStudioMovieDel.size() > 0) {
                    movieStudioDAO.deleteAll(listStudioMovieDel);
                }
                if (listMovieStudioCreate.size() > 0) {
                    movieStudioDAO.saveAll(listMovieStudioCreate);
                }
            }
            dao.save(movieForm);
            return ResponseEntity.ok(movieForm);
        } catch (Exception e) {
            logger.error("[PUT] - Error: {}", e.toString());
            return new ResponseEntity<>("Cập nhật, có lỗi trong việc cập nhật Movie",
                    HttpStatus.CONFLICT);
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {

            if (!dao.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            Movie movie = dao.findById(id).get();
            for (int i = 0; i < movie.getFormatsMovies().size(); i++) {
                if (!movie.getFormatsMovies().get(i).getShowtimes().isEmpty()) {
                    return new ResponseEntity<>("Không thể xoá, phim đã được thêm vào lịch chiếu", HttpStatus.CONFLICT);
                }
            }
            actorMovieDAO.deleteAll(movie.getActorsMovies());
            directorMovieDAO.deleteAll(movie.getDirectorsMovies());
            genreMovieDAO.deleteAll(movie.getGenresMovies());
            movieProducerDAO.deleteAll(movie.getMoviesProducers());
            movieStudioDAO.deleteAll(movie.getMoviesStudios());
            formatMovieDAO.deleteAll(movie.getFormatsMovies());
            UploadImageService.deleteImage(movie.getPoster());
            dao.deleteById(id);
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            logger.error("[DELETE] - Error", e.toString());
            return new ResponseEntity<>("Không thể xoá, có lỗi trong việc xóa dữ liệu", HttpStatus.CONFLICT);
        }
    }

    ////////////////////////////////
    // @GetMapping("/get/movies-by-cinemaComplex/{cinemaComplexId}/{date}")
    // public ResponseEntity<?> getDuLie(
    // @PathVariable("cinemaComplexId") Long CinemaComplexId,
    // @PathVariable("date") LocalDate date) {
    // try {
    // if (CinemaComplexId.equals("")) {
    // return new ResponseEntity<>("Lỗi", HttpStatus.NOT_FOUND);
    // }
    // if (date == null || date.equals("")) {
    // date = LocalDate.now();
    // }
    // CinemaComplex cinemaComplex =
    //////////////////////////////// cinemaComplexDao.findById(CinemaComplexId).get();
    // if (cinemaComplex != null) {
    // List<Movie> movie = dao.getMoviesByCinemaComplex(cinemaComplex, date);
    // return ResponseEntity.ok(movie);
    // }
    // return new ResponseEntity<>("Lỗi", HttpStatus.NOT_FOUND);
    // } catch (Exception e) {
    // return new ResponseEntity<>("Lỗi kết nối server",
    //////////////////////////////// HttpStatus.INTERNAL_SERVER_ERROR);
    // }

    // }

    @GetMapping("/get/movies-by-cinemaComplex")
    public ResponseEntity<?> moviesByCinemaComplex(
            @RequestParam("cinemaComplexId") Long cinemaComplexId,
            @RequestParam("date") Optional<LocalDate> date) {
        try {
            if (cinemaComplexId.equals("")) {
                return new ResponseEntity<>("Không tìm thấy phim cụm rạp", HttpStatus.NOT_FOUND);
            }

            CinemaComplex cinemaComplex = cinemaComplexDao.findById(cinemaComplexId).get();
            List<Movie> movies = dao.getMoviesByCinemaComplex(cinemaComplex, date.orElse(LocalDate.now()));

            if (movies.isEmpty()) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            MovieShowtimeDTO movieShowtimeDTO = new MovieShowtimeDTO();

            List<MovieShowtimeDTO.MovieObjResp> listMovieObjResp = new ArrayList<>();

            for (Movie movie : movies) {

                MovieShowtimeDTO.MovieObjResp movieObjResp = movieShowtimeDTO.new MovieObjResp();

                List<MovieShowtimeDTO.MovieObjResp.FormatAndShowtimes> listFormatAndShowtimes = new ArrayList<>();

                List<Genre> genres = new ArrayList<>();
                for (GenreMovie genreMovie : movie.getGenresMovies()) {
                    genres.add(genreMovie.getGenre());
                }

                for (FormatMovie formatMovie : movie.getFormatsMovies()) {

                    MovieShowtimeDTO.MovieObjResp.FormatAndShowtimes formatAndShowtimes = movieObjResp.new FormatAndShowtimes();

                    formatAndShowtimes.setFormat(formatMovie.getFormat());

                    List<Showtime> showtime = showtimeDao.getShowtimesByCCXAndMovieAndFormatAndDate(cinemaComplex,
                            movie, formatMovie.getFormat(), date.orElse(LocalDate.now()));
                    formatAndShowtimes.setShowtimes(showtime);
                    listFormatAndShowtimes.add(formatAndShowtimes);

                }

                movieObjResp.setMovie(movie);
                movieObjResp.setGenres(genres);
                movieObjResp.setListFormatAndShowtimes(listFormatAndShowtimes);

                listMovieObjResp.add(movieObjResp);
                movieShowtimeDTO.setListMovieObjResp(listMovieObjResp);
            }

            return ResponseEntity.ok(movieShowtimeDTO);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/get/movie-showing")
    public ResponseEntity<?> getMovieShowing() {
        try {
            List<Movie> movie = dao.getMoviesExistsMovieIdShowtimes();
            return ResponseEntity.ok(movie);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/get/find-movie-by-genre-country-year-search")
    public ResponseEntity<?> findMovieByGenreAndCountryAndSearch(
            @RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit,
            @RequestParam("genreName") Optional<String> genreName,
            @RequestParam("country") Optional<String> country,
            @RequestParam("year") Optional<String> year,
            @RequestParam("search") Optional<String> search) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Tài nguyên không tồn tại", HttpStatus.BAD_REQUEST);
            }
            if (genreName.isPresent() && genreName.get().equalsIgnoreCase("tất cả")) {
                genreName = Optional.empty();
            }
            if (country.isPresent() && country.get().equalsIgnoreCase("tất cả")
                    || country.get().equalsIgnoreCase("tc")) {
                country = Optional.empty();
            }
            if (year.isPresent() && year.get().equalsIgnoreCase("tất cả")) {
                year = Optional.empty();
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<Movie> page = dao.findMovieByGenreAndCountryAndSearch(genreName.orElse(""), country.orElse(""),
                    year.orElse(""), search.orElse(""), pageable);

            SearchMovieDTO searchMovieDTO = new SearchMovieDTO();
            List<SearchMovieDTO.MovieObjResp> listMovieObjResp = new ArrayList<>();

            for (Movie movie : page.getContent()) {
                SearchMovieDTO.MovieObjResp movieObjResp = searchMovieDTO.new MovieObjResp();
                List<Genre> genres = new ArrayList<>();
                for (GenreMovie genrMovie : movie.getGenresMovies()) {
                    genres.add(genrMovie.getGenre());
                }
                movieObjResp.setMovie(movie);
                movieObjResp.setGenres(genres);
                listMovieObjResp.add(movieObjResp);
                searchMovieDTO.setListMovieObjResp(listMovieObjResp);
            }

            searchMovieDTO.setTotalItems(page.getTotalElements());
            searchMovieDTO.setTotalPages(page.getTotalPages());
            return ResponseEntity.ok(searchMovieDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server12", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/movie-suggest")
    public ResponseEntity<?> getMovieByRandom(@RequestParam("limit") Optional<Integer> limit,
            @RequestParam("userId") String userId) {
        try {
            Pageable pageable = PageRequest.of(0, limit.orElse(10));
            Page<Movie> page;
            if (userId.isEmpty()) {
                page = dao.findMovieShowtimePresent(pageable);

            } else {
                page = dao.findMovieShowtimePresentNotExistsByUser(pageable, userId);
            }

            MovieByShowtimeShowingDTO movieShowingDTO = new MovieByShowtimeShowingDTO();
            List<MovieByShowtimeShowingDTO.MovieObjResp> listMovieObjResp = new ArrayList<>();
            for (Movie movie : page.getContent()) {
                MovieByShowtimeShowingDTO.MovieObjResp movieObjResp = movieShowingDTO.new MovieObjResp();
                List<Genre> genres = new ArrayList<>();
                for (GenreMovie genreMovie : movie.getGenresMovies()) {
                    genres.add(genreMovie.getGenre());
                }
                movieObjResp.setMovie(movie);
                movieObjResp.setGenres(genres);
                listMovieObjResp.add(movieObjResp);
                movieShowingDTO.setListMovieObjResp(listMovieObjResp);
            }
            return ResponseEntity.ok(movieShowingDTO);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // lấy actor và director theo id của movie
    @GetMapping("/get/actor-director-by-movie/{id}")
    public ResponseEntity<?> getActorAndDirector(@PathVariable("id") Long id) {
        try {
            Movie movie = dao.findById(id).get();
            ActorAndDirectorDTO actorAndDirectorDTO = new ActorAndDirectorDTO();
            ActorAndDirectorDTO.ActorAndDirectorsObj actorAndDirectorsObj = actorAndDirectorDTO.new ActorAndDirectorsObj();
            List<Actor> actors = new ArrayList<>();
            List<Director> directors = new ArrayList<>();
            for (ActorMovie actorMovie : movie.getActorsMovies()) {
                actors.add(actorMovie.getActor());

            }
            for (DirectorMovie directorMovie : movie.getDirectorsMovies()) {
                directors.add(directorMovie.getDirector());
            }
            actorAndDirectorsObj.setActors(actors);
            actorAndDirectorsObj.setDirectors(directors);
            actorAndDirectorDTO.setActorAndDirectorsObj(actorAndDirectorsObj);

            return ResponseEntity.ok(actorAndDirectorDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/movie-by-showtime-showing")
    public ResponseEntity<?> getMovieByShowtimeShowing() {
        try {
            List<Movie> movies = dao.getMovieByShowtimeShowing();
            MovieByShowtimeShowingDTO movieShowingDTO = new MovieByShowtimeShowingDTO();
            List<MovieByShowtimeShowingDTO.MovieObjResp> listMovieObjResp = new ArrayList<>();
            for (Movie movie : movies) {
                MovieByShowtimeShowingDTO.MovieObjResp movieObjResp = movieShowingDTO.new MovieObjResp();
                List<Genre> genres = new ArrayList<>();
                for (GenreMovie genrMovie : movie.getGenresMovies()) {
                    genres.add(genrMovie.getGenre());
                }
                movieObjResp.setMovie(movie);
                movieObjResp.setGenres(genres);
                listMovieObjResp.add(movieObjResp);
                movieShowingDTO.setListMovieObjResp(listMovieObjResp);

            }
            return ResponseEntity.ok(movieShowingDTO);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/movie-by-showtime-upcoming")
    public ResponseEntity<?> getMovieByShowtimeUpcoming() {
        try {
            List<Movie> movies = dao.getMovieByShowtimeUpcoming();
            MovieByShowtimeShowingDTO movieShowingDTO = new MovieByShowtimeShowingDTO();
            List<MovieByShowtimeShowingDTO.MovieObjResp> listMovieObjResp = new ArrayList<>();
            for (Movie movie : movies) {
                MovieByShowtimeShowingDTO.MovieObjResp movieObjResp = movieShowingDTO.new MovieObjResp();
                List<Genre> genres = new ArrayList<>();
                for (GenreMovie genrMovie : movie.getGenresMovies()) {
                    genres.add(genrMovie.getGenre());
                }
                movieObjResp.setMovie(movie);
                movieObjResp.setGenres(genres);
                listMovieObjResp.add(movieObjResp);
                movieShowingDTO.setListMovieObjResp(listMovieObjResp);

            }
            return ResponseEntity.ok(movieShowingDTO);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy ra 5 sản phẩm có booking cao nhất
    @GetMapping("/get/fivemovie")
    public ResponseEntity<List<MovieDTO>> findFiveMovie() {
        List<Movie> movies = dao.findTop5MoviesWithMostBookings();
        List<MovieDTO> movieDTOList = new ArrayList<>();

        for (Movie movie : movies) {
            List<Actor> actors = new ArrayList<>();
            List<Director> directors = new ArrayList<>();
            List<Format> formats = new ArrayList<>();
            List<Genre> genres = new ArrayList<>();

            for (ActorMovie actorMovie : movie.getActorsMovies()) {
                actors.add(actorMovie.getActor());
            }
            for (DirectorMovie directorMovie : movie.getDirectorsMovies()) {
                directors.add(directorMovie.getDirector());
            }
            for (FormatMovie formatMovie : movie.getFormatsMovies()) {
                formats.add(formatMovie.getFormat());
            }
            for (GenreMovie genreMovie : movie.getGenresMovies()) {
                genres.add(genreMovie.getGenre());
            }

            MovieDTO movieDTO = new MovieDTO(movie, directors, actors, genres, formats, null, null);
            movieDTOList.add(movieDTO);
        }

        return ResponseEntity.ok(movieDTOList);
    }

    @GetMapping("/get/movie-by-showtime-showing-genres/{genresId}")
    public ResponseEntity<?> getMovieByShowtimeShowingByGenres(@PathVariable("genresId") Long genresId) {
        try {
            List<Movie> movies = dao.getMovieByShowtimeShowingByGenres(genresId);
            MovieByShowtimeShowingDTO movieShowingDTO = new MovieByShowtimeShowingDTO();
            List<MovieByShowtimeShowingDTO.MovieObjResp> listMovieObjResp = new ArrayList<>();
            for (Movie movie : movies) {
                MovieByShowtimeShowingDTO.MovieObjResp movieObjResp = movieShowingDTO.new MovieObjResp();
                List<Genre> genres = new ArrayList<>();
                for (GenreMovie genrMovie : movie.getGenresMovies()) {
                    genres.add(genrMovie.getGenre());
                }
                movieObjResp.setMovie(movie);
                movieObjResp.setGenres(genres);
                listMovieObjResp.add(movieObjResp);
                movieShowingDTO.setListMovieObjResp(listMovieObjResp);

            }
            return ResponseEntity.ok(movieShowingDTO);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/total-ticket")
    public ResponseEntity<?> getTotalTickets() {
        try {
            List<TotalDashboardAdmin> movie = dao.getTotalTickets();
            return ResponseEntity.ok(movie);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/get/total-movie")
    public ResponseEntity<?> getTotalMovies() {
        try {
            List<TotalDashboardAdmin> movie = dao.getTotalMovies();
            return ResponseEntity.ok(movie);

        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi kết nối server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
