import axiosClient from '~/api/global/axiosClient';
import BaseApi from '~/api/global/baseApi';

class GenreApi extends BaseApi {
    constructor() {
        super('genre');
    }
    // async getAll() {
    //     return axiosClient.get(this.uri + );
    // }
}
const genreApi = new GenreApi();
export default genreApi;
