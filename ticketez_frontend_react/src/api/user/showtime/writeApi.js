import axiosClient from '~/api/global/axiosClient';
import funcUtils from '~/utils/funcUtils';

const urlCinemaComplex = 'cinemaComplex';
export const cinemaComplexUserApi = {
    getByResultsProvinceIdAndCinemaChainNameAndSearchName: async (
        results,
        provinceId,
        cinemaChainName,
        searchNameCCX,
    ) => {
        const params = {
            results,
            provinceId,
            cinemaChainName,
            searchNameCCX,
        };
        try {
            const result = await axiosClient.get(
                urlCinemaComplex + '/get/get-cinemaComplex-by-provinceId-cinemaChainName-searchNameCCX',
                { params },
            );
            return result.data;
        } catch (error) {
            return error;
        }
    },
    getCcxFormatShowtimeByMovie: async (movieId, provinceId, cinemaChainName, date) => {
        const params = {
            movieId,
            provinceId,
            cinemaChainName,
            date,
        };
        try {
            const result = await axiosClient.get(urlCinemaComplex + '/get/ccx-format-showtime-by-movie', { params });
            return result.data;
        } catch (error) {
            return error;
        }
    },
};

// ****************************************************************

const urlMovie = 'movie';
export const movieUserApi = {
    getMovieByCinemaComplex: async (cinemaComplexId, date) => {
        try {
            if (cinemaComplexId ?? cinemaComplexId) {
                const result = await axiosClient.get(
                    urlMovie + '/get/movies-by-cinemaComplex/' + cinemaComplexId + '/' + date,
                );
                return result.data;
            }
            return funcUtils.notify('CinemaComplexId không tồn tại', 'error');
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    getMovieAllByCinemaComplexAndDate: async (cinemaComplexId, date) => {
        try {
            if (cinemaComplexId ?? cinemaComplexId) {
                const params = {
                    cinemaComplexId,
                    date,
                };
                const result = await axiosClient.get(urlMovie + '/get/movies-by-cinemaComplex', { params });
                return result.data;
            }
            return funcUtils.notify('CinemaComplexId không tồn tại', 'error');
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    getMoviesByGenreNameAndCountryAndYearAndSearch: async (page, limit, genreName, country, year, search) => {
        try {
            const params = { page, limit, genreName, country, year, search };
            const result = await axiosClient.get(urlMovie + '/get/find-movie-by-genre-country-year-search', { params });
            return result.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    getMovieShowtimePresentOrByUser: async ( userId ) => {
        try {
            const params = {
                userId
            };
            const result = await axiosClient.get(urlMovie + '/get/movie-suggest', { params });
            return result.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
};
// ****************************************************************

// const urlGenreMovie = 'genreMovie';
// export const genreMovieUserApi = {
//     getAllGenreMovie: async () => {
//         try {
//             // console.log(data);
//             const result = await axiosClient.get(urlGenreMovie);
//             return result.data;
//         } catch (error) {
//             // console.log(error);
//             return error;
//         }
//     },
// };

// ****************************************************************

// const urlFormatMovie = 'formatMovie';
// export const formatMovieUserApi = {
//     getAllFormatMovie: async () => {
//         try {
//             const result = await axiosClient.get(urlFormatMovie);
//             return result.data;
//         } catch (error) {
//             return error;
//         }
//     },
// };

const urlGenre = 'genre';
export const genreUserApi = {
    getGenreByMovie: async (movieId) => {
        try {
            if (movieId ?? movieId) {
                const result = await axiosClient.get(urlGenre + '/get/genre-by-movie/' + movieId);
                return result.data;
            }
            return funcUtils.notify('MovieId không tồn tại', 'error');
        } catch (error) {
            return error;
        }
    },
};

const urlFormat = 'format';
export const formatUserApi = {
    getFormatByMovie: async (movieId) => {
        try {
            if (movieId ?? movieId) {
                const result = await axiosClient.get(urlFormat + '/get/format-by-movie/' + movieId);
                return result.data;
            }
            return funcUtils.notify('MovieId không tồn tại', 'error');
        } catch (error) {
            return error;
        }
    },
};

const urlCinema = 'cinema';
export const cinemaUserApi = {
    getCinemaByCinemaComplex: async (cinemaComplexId) => {
        try {
            const result = await axiosClient.get(urlCinema + '/get/cinema-by-cinemaComplex/' + cinemaComplexId);
            return result.data;
        } catch (error) {
            return error;
        }
    },
};

const urlShowtime = 'showtime';
export const showtimeUserApi = {
    getShowtimesByCCXIdAndMovieIdAndFormatIdAndDate: async (cinemaComplexId, movieId, formatId, date) => {
        const params = {
            cinemaComplexId,
            movieId,
            formatId,
            date,
        };
        try {
            // const result = await axiosClient.get(
            //     urlShowtime +
            //         '/get/showtime-by-ccx-movie-format-date/' +
            //         cinemaComplexId +
            //         '/' +
            //         movieId +
            //         '/' +
            //         formatId +
            //         '/' +
            //         date,
            // );
            const result = await axiosClient.get(urlShowtime + '/get/showtime-by-ccx-movie-format-date', { params });
            return result.data;
        } catch (error) {
            return error;
        }
    },
};

const urlProvince = 'province';
export const provinceUserApi = {
    getAllProvinceByName: async (name) => {
        const params = { name };
        try {
            const result = await axiosClient.get(urlProvince + '/get/province-by-name', { params });
            return result.data;
        } catch (error) {
            return error;
        }
    },
};
