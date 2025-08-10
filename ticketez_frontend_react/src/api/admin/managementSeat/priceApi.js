import axiosClient from '~/api/global/axiosClient';
import BaseApi from '~/api/global/baseApi';

class PriceSeatApi extends BaseApi {
    constructor() {
        super('price');
    }
    async getListPriceDbBySeatType(cinemaCplxId, movieId) {
        return axiosClient.get(`/price/findByCinemaComplexIdAndMovieId/${cinemaCplxId}/${movieId}`);
    }
    async findAllPriceAndPriceSeatTypeDTOByShowtimeId(showtimeId) {
        return axiosClient.get(`/price/findByShowtimeId/${showtimeId}`);
    }

    async getPriceByMovieAndCinemaComplexAndDate(movieId, formatId, cinemaComplexId, date) {
        return axiosClient.get(
            '/price/get/price-by-movie-cinemaComplex/' + movieId + '/' + formatId + '/' + cinemaComplexId + '/' + date,
        );
    }
    async findAllPriceAndPriceSeatTypeDTOByCinemaComplexIdAndMovieId(cinemaComplexId, movieId) {
        return axiosClient.get('/price/findByCinemaComplexIdAndMovieId/' + cinemaComplexId + '/' + movieId);
    }
}
const priceSeatApi = new PriceSeatApi();
export default priceSeatApi;
