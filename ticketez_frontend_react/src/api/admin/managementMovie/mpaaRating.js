import BaseApi from '~/api/global/baseApi';

class MpaaRatingApi extends BaseApi {
    constructor() {
        super('mpaaRating');
    }
}
const mpaaRatingApi = new MpaaRatingApi();
export default mpaaRatingApi;
