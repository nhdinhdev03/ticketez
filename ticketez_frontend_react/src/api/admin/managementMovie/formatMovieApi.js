import axiosClient from '../../global/axiosClient';

const url = 'formatMovie';

const formatMovieApi = {
    getId: async (formatId) => {
        return axiosClient.get(url + '/' + formatId);
    },
    get: async () => {
        return axiosClient.get(url);
    },
    getDistinctMovieIds: async () => {
        return axiosClient.get(url + '/getDistinctMovie');
    },
    getDistinctFormarIds: async (movieId) => {
        return axiosClient.get(url + '/getDistinctFormat/' + movieId);
    },
    getIdFormatMovieByFormatAndMovie: async (movieId, formatID) => {
        return axiosClient.get(url + '/get/IdFormatMovieByFormatAndMovie/' + movieId + '/' + formatID);
    },
    post: async (data) => {
        return axiosClient.post(url, data);
    },
    put: async (id, data) => {
        return axiosClient.put(url + '/' + id, data);
    },
    delete: async (formatId) => {
        return axiosClient.delete(url + '/' + formatId);
    },
    getMovieByGenre: async (movieId) => {
        return axiosClient.get(url + '/getMovieByGenres/' + movieId);
    },
};

export default formatMovieApi;
