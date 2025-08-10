import axiosClient from '../../global/axiosClient';

const url = 'seatchart';

const seatChartApi = {
    getId: async (id) => {
        return axiosClient.get(url + '/' + id);
    },
    get: async () => {
        return axiosClient.get(url + '/getAll');
    },
    getCinemaByCinemaComplexAndSeatChartTrue: async (cinemaComplexId) => {
        return axiosClient.get(url + '/get/cinema-by-cinemaComplex-by-seatchartTrue/' + cinemaComplexId);
    },
    getSeatChartByCinema: async (cinemaId) => {
        return axiosClient.get(url + '/get/seatChart-by-cinema/' + cinemaId);
    },
    post: async (data) => {
        return axiosClient.post(url, data);
    },
    put: async (id, data) => {
        return axiosClient.put(url + '/' + id, data);
    },
    delete: async (id) => {
        return axiosClient.delete(url + '/' + id);
    },
};
export default seatChartApi;
