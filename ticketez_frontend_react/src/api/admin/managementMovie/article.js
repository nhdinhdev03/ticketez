import axiosClient from '~/api/global/axiosClient';
import BaseApi from '~/api/global/baseApi';

class ArticleApi extends BaseApi {
    constructor() {
        super('article');
    }
    async getPageArticle(page = 1, limit = 10, search = '') {
        const params = {
            page,
            limit,
            search,
        };
        return axiosClient.get('/article/get/article-movie', { params });
    }
    async getPageArticleTrue() {
        
        return axiosClient.get('/article/get/article-movie-true');
    }
}
const articleApi = new ArticleApi();
export default articleApi;

