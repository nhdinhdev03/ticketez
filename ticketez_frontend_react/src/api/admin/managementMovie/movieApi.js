import BaseApi from '~/api/global/baseApi';

class MovieApi extends BaseApi {
    constructor() {
        super('movie');
    }
}
const movieApi = new MovieApi();
export default movieApi;
