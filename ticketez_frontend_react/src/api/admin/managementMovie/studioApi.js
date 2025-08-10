import BaseApi from '~/api/global/baseApi';

class StudioApi extends BaseApi {
    constructor() {
        super('studio');
    }
}
const studioApi = new StudioApi();
export default studioApi;
