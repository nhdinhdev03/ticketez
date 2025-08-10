import BaseApi from '~/api/global/baseApi';


class ProfileApi extends BaseApi {
    constructor() {
        super('auth');
    }

}
const profileApi = new ProfileApi();
export default profileApi;
