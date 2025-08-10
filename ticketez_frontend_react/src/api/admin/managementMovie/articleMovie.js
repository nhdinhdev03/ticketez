import axiosClient from '../../global/axiosClient';

const url = 'articleMovie';

const articleMovieAPI = {

    getMovieByArticle: async (articleId) => {
        return axiosClient.get(url + '/get/movie-by-article/' + articleId);
    },

};
export default articleMovieAPI;
